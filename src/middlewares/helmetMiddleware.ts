import helmet from 'helmet';

const helmetMiddleware = () => {
    return helmet({
        // Not needed for JSON APIs.
        // CSP is a browser security mechanism that controls which sources a page can load scripts, styles, images, and other resources from. It can help mitigate cross-site scripting (XSS).
        contentSecurityPolicy: false,

        // Disable cross-origin isolation.
        crossOriginEmbedderPolicy: false,

        // Force HTTPS.
        hsts: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        },

        // Hide referrer information.
        referrerPolicy: {
            policy: "no-referrer",
        },

        // Block iframe embedding.
        frameguard: {
            action: "deny",
        },

        // Disable MIME sniffing.
        noSniff: true,

        // Legacy header, not needed.
        xssFilter: false,
    });
};

export default helmetMiddleware;