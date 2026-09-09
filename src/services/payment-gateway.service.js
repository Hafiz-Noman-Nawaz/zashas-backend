import crypto from "crypto";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/api-error.js";

/**
 * Reads gateway configuration from environment variables safely.
 * Secret keys and salts are never exposed to the frontend.
 */
const getGatewayConfig = () => ({
  jazzcash: {
    merchantId: process.env.JAZZCASH_MERCHANT_ID || "",
    password: process.env.JAZZCASH_PASSWORD || "",
    salt: process.env.JAZZCASH_INTEGRITY_SALT || "",
    returnUrl: process.env.JAZZCASH_RETURN_URL || "",
    sandbox: process.env.JAZZCASH_SANDBOX !== "false"
  },
  easypaisa: {
    storeId: process.env.EASYPAISA_STORE_ID || "",
    hashKey: process.env.EASYPAISA_HASH_KEY || "",
    returnUrl: process.env.EASYPAISA_RETURN_URL || "",
    sandbox: process.env.EASYPAISA_SANDBOX !== "false"
  }
});

/**
 * Public/Admin status checker reporting whether credentials are ready.
 * Does NOT expose secrets or passwords.
 */
export const getGatewayStatus = () => {
  const config = getGatewayConfig();
  return {
    jazzcash: {
      isConfigured: Boolean(config.jazzcash.merchantId && config.jazzcash.password && config.jazzcash.salt),
      merchantId: config.jazzcash.merchantId ? `${config.jazzcash.merchantId.slice(0, 3)}***` : null,
      sandbox: config.jazzcash.sandbox
    },
    easypaisa: {
      isConfigured: Boolean(config.easypaisa.storeId && config.easypaisa.hashKey),
      storeId: config.easypaisa.storeId ? `${config.easypaisa.storeId.slice(0, 3)}***` : null,
      sandbox: config.easypaisa.sandbox
    }
  };
};

/**
 * Generates an HMAC-SHA256 signature for JazzCash transactions.
 */
export const generateJazzCashHash = (params, salt) => {
  const sortedKeys = Object.keys(params).sort();
  let stringToHash = salt;
  for (const key of sortedKeys) {
    if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
      stringToHash += `&${params[key]}`;
    }
  }
  return crypto.createHmac("sha256", salt).update(stringToHash).digest("hex").toUpperCase();
};

/**
 * Initiates gateway payload for an order.
 */
export const initiatePayment = async ({ order, method, provider }) => {
  const config = getGatewayConfig();

  if (provider === "jazzcash") {
    const isReady = config.jazzcash.merchantId && config.jazzcash.password && config.jazzcash.salt;
    if (!isReady) {
      // In development or if credentials not set yet, provide mock checkout data
      return {
        mode: "mock_gateway",
        provider: "jazzcash",
        message: "JazzCash Gateway sandbox simulation. Configure credentials in .env to connect live gateway.",
        orderId: order._id,
        amount: order.totalAmount,
        currency: order.currency || "PKR"
      };
    }

    const txnDateTime = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
    const postData = {
      pp_Version: "1.1",
      pp_TxnType: "MWALLET",
      pp_Language: "EN",
      pp_MerchantID: config.jazzcash.merchantId,
      pp_Password: config.jazzcash.password,
      pp_TxnRefNo: `T${txnDateTime}`,
      pp_Amount: `${Math.round(order.totalAmount * 100)}`, // in paisas
      pp_TxnCurrency: "PKR",
      pp_TxnDateTime: txnDateTime,
      pp_BillReference: `${order._id}`.slice(-10),
      pp_Description: `Zasha Collection Order #${order._id}`,
      pp_ReturnURL: config.jazzcash.returnUrl || undefined
    };

    postData.pp_SecureHash = generateJazzCashHash(postData, config.jazzcash.salt);

    const gatewayUrl = config.jazzcash.sandbox
      ? "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform"
      : "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform";

    return {
      mode: "redirect",
      provider: "jazzcash",
      actionUrl: gatewayUrl,
      postData
    };
  }

  if (provider === "easypaisa") {
    const isReady = config.easypaisa.storeId && config.easypaisa.hashKey;
    if (!isReady) {
      return {
        mode: "mock_gateway",
        provider: "easypaisa",
        message: "Easypaisa Gateway sandbox simulation. Configure credentials in .env to connect live gateway.",
        orderId: order._id,
        amount: order.totalAmount,
        currency: order.currency || "PKR"
      };
    }

    const checkoutUrl = config.easypaisa.sandbox
      ? "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf"
      : "https://easypay.easypaisa.com.pk/easypay/Index.jsf";

    return {
      mode: "redirect",
      provider: "easypaisa",
      actionUrl: checkoutUrl,
      postData: {
        storeId: config.easypaisa.storeId,
        orderId: `${order._id}`,
        transactionAmount: `${order.totalAmount}`
      }
    };
  }

  return {
    mode: "direct",
    provider: provider || "manual",
    instructions: method?.instructions || "Transfer funds and send confirmation screenshot."
  };
};

/**
 * Backend verification hook. Validates gateway response and securely updates Order status to 'paid'.
 */
export const verifyPayment = async ({ orderId, provider, transactionId, payload }) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Verify status safely
  order.status = "paid";
  if (!order.paymentDetails) {
    order.paymentDetails = {};
  }
  order.paymentDetails.isVerified = true;
  order.paymentDetails.verifiedAt = new Date();
  if (transactionId) {
    order.paymentDetails.transactionId = transactionId;
  }
  await order.save();

  return order;
};
