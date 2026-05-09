import nodemailer from "nodemailer";

// In a real production scenario, use real SMTP credentials from .env
// For demo/development, we can use a mock or ethereal email if needed, 
// or simply assume SMTP variables exist.

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: process.env.SMTP_PORT || 587,
  auth: {
    user: process.env.SMTP_USER || "ethereal.user@ethereal.email",
    pass: process.env.SMTP_PASS || "ethereal_password",
  },
});

export const sendOrderConfirmationEmail = async (order) => {
  if (!order.customerDetails?.email) {
    console.log("No email provided by customer. Skipping email confirmation.");
    return;
  }

  const mailOptions = {
    from: '"Zasha\'s Collection" <orders@zashascollection.com>',
    to: order.customerDetails.email,
    subject: `Order Confirmation - ${order._id}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #c9a96e; text-align: center;">Zasha's Collection</h2>
        <h3>Thank you for your order, ${order.customerDetails.fullName}!</h3>
        <p>Your order has been successfully placed and is now <strong>${order.status}</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p><strong>Tracking ID:</strong> ${order._id}</p>
          <p><strong>Total Amount:</strong> PKR ${order.totalAmount}</p>
          <p><strong>Payment Method:</strong> ${order.paymentDetails?.method}</p>
        </div>

        <h4 style="margin-top: 25px;">Shipping To:</h4>
        <p style="font-size: 14px; color: #555;">
          ${order.customerDetails.address}<br />
          ${order.customerDetails.city}, ${order.customerDetails.province || ''} ${order.customerDetails.postalCode || ''}
        </p>

        <p style="margin-top: 30px; font-size: 13px; color: #777; text-align: center;">
          If you have any questions, reply to this email or contact us on WhatsApp.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
  }
};
