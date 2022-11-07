const createDMG = require('electron-installer-dmg');
const { notarize } = require('@electron/notarize');
const glob = require('glob');
const { version } = require('../package.json');

const appleIdPassword = '@keychain:Terrarium'; // add to keychain with below command
// security add-generic-password -a "<APPLDE_DEV_ID_HERE>" -s Terrarium -w "<APP_SPECIFIC_PASSWORD_HERE>"

const appleId = 'Jason Stallings (75EGRT7282)';
const appBundleId = 'com.terrarium.app';

glob(`${__dirname}/../dist/**/Terrarium.app`, {}, (err, appPaths) => {
  appPaths.forEach(async (appPath) => {
    try {
      console.log('Notarizing: ', appPath);
      await notarize({
        tool: 'notarytool',
        appBundleId,
        teamId: 'terra.money',
        appPath,
        appleId,
        appleIdPassword,
      });
      console.log('Creating DMG for: ', appPath);
      await createDMG({
        appPath,
        out: './installers',
        name: `terrarium-${version}${appPath.includes('arm64') ? '-arm64' : ''}`,
        overwrite: true,
        debug: true,
        icon: '../assets/icon.icns',
      });
    } catch (e) {
      console.error(`Error notarizing or building DMG ${appPath}: `, e);
    }
  });
});
