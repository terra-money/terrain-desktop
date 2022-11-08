const createDMG = require('electron-installer-dmg');
const { notarize } = require('@electron/notarize');
const glob = require('glob');
const { version } = require('../package.json');

const notarizeApp = async (appPath) => {
  try {
    console.log('Notarizing: ', appPath);
    await notarize({
      appBundleId: 'com.terrarium.app',
      appPath,
      appleId: process.env.appleId, // export appleId="<APPLE_ID_HERE>"
      appleIdPassword: '@keychain:Terrarium', // security add-generic-password -a "<APPLDE_DEV_ID_HERE>" -s Terrarium -w "<APP_SPECIFIC_PASSWORD_HERE>"
    });
  } catch (err) {
    console.error(`Error notarizing ${appPath}: `, err);
  }
};
const createAppDmg = async (appPath) => {
  try {
    await createDMG({
      appPath,
      out: './installers',
      name: `terrarium-${version}${appPath.includes('arm64') ? '-arm64' : ''}`,
      overwrite: true,
      debug: true,
    });
  } catch (err) {
    console.error(`Error creating DMG for ${appPath}: `, err);
  }
};

glob(`${__dirname}/../dist/**/Terrarium.app`, {}, (err, appPaths) => {
  appPaths.forEach(async (appPath) => {
    await notarizeApp(appPath);
    await createAppDmg(appPath);
  });
});
