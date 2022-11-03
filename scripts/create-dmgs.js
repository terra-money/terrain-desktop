const createDMG = require('electron-installer-dmg');
const glob = require('glob');
const { version } = require('../package.json');

glob(`${__dirname}/../dist/**/Terrarium.app`, {}, (err, appPaths) => {
  appPaths.forEach((appPath) => {
    try {
      console.log('Creating DMG for: ', appPath);
      createDMG({
        appPath,
        out: './installers',
        name: `terrarium-${version}${appPath.includes('arm64') ? '-arm64' : ''}`,
        overwrite: true,
        debug: true,
      });
    } catch (e) {
      console.error(`Error building DMG ${appPath}: `, e);
    }
  });
});
