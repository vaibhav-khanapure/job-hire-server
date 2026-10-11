module.exports = {
    apps: [
        {
            name: 'user-service',
            script: './dist/app/index.js',
            instances: 'max',
            exec_mode: 'cluster',
            autorestart: true,
            watch: false,
        },
    ],
};