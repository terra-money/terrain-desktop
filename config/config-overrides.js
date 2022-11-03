const semver = require('semver');
const { aliasWebpack } = require('react-app-alias');
const pkg = require('../package.json');

if (!semver.satisfies(process.version, pkg.engines.node)) {
  console.log(`Required node version ${pkg.engines.node} not satisfied with current version ${process.version}.`);
  process.exit(1);
}

module.exports = {
  ...aliasWebpack({}),
  webpack(config) {
    config.target = 'electron-renderer';
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
  },
};
