import rateLimit from "express-rate-limit";

const rateLimiter = () => {
    return rateLimit({
        // Time window (15 minutes).
        windowMs: 15 * 60 * 1000,

        // Max requests per IP during the window.
        max: 100,

        // Return modern RateLimit headers.
        standardHeaders: true,

        // Disable legacy X-RateLimit-* headers.
        legacyHeaders: false,

        // Custom response when limit is exceeded.
        message: {
            message: "Too many requests",
        },

        // HTTP status code when rate limited.
        statusCode: 429,

        // Skip successful requests (2xx, 3xx).
        skipSuccessfulRequests: false,

        // Skip failed requests (4xx, 5xx).
        skipFailedRequests: false,

        // Custom key for tracking (default: IP address).
        // keyGenerator: (req) => req.ip,

        // Disable limiter for specific requests.
        // skip: (req) => req.path === "/health",
    });
};

export default rateLimiter;