module.exports = {
    webpack (config, env) {
        config.target = 'electron-renderer';
        config.ignoreWarnings = [/Failed to parse source map/];
        return config;
    },
}