import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import morgan from "morgan";
import xss from "xss";

import env from "./config/env.js";
import errorHandler from "./middlewares/error-handler.js";
import notFound from "./middlewares/not-found.js";
import routes from "./routes/index.js";

const app = express();

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 300,
	standardHeaders: true,
	legacyHeaders: false
});

const sanitizeInput = (value) => {
	if (typeof value === "string") {
		return xss(value);
	}
	if (Array.isArray(value)) {
		return value.map((item) => sanitizeInput(item));
	}
	if (value && typeof value === "object") {
		return Object.keys(value).reduce((acc, key) => {
			acc[key] = sanitizeInput(value[key]);
			return acc;
		}, {});
	}

	return value;
};

const xssSanitizer = (req, res, next) => {
	if (req.body) {
		req.body = sanitizeInput(req.body);
	}
	if (req.query) {
		req.query = sanitizeInput(req.query);
	}
	if (req.params) {
		req.params = sanitizeInput(req.params);
	}
	next();
};

app.use(helmet());
app.use(apiLimiter);
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(mongoSanitize());
app.use(xssSanitizer);
app.use(hpp());
app.use(cookieParser());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
