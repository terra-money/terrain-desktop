module.exports = {
    webpack: function (config, env) {
        config.target = 'electron-renderer'
        return config;
    },
}