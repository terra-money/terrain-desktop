module.exports = {
    webpack (config, env) {
        config.target = 'electron-renderer'
        return config;
    },
}