const createDMG = require('electron-installer-dmg');
const fs = require('fs');
const { signAsync } = require('@electron/osx-sign');

fs.readdirSync('./out').forEach(async (file) => {
  if (file === 'make') return;
  const appPath = `./out/${file}/Terrarium.app`;

  try {
    console.log('Signing:', file);
    await signAsync({
      app: appPath,
      identity: 'Developer ID Application: Jason Stallings (75EGRT7282)',
    });

    console.log('Creating DMG for: ', file);
    await createDMG({
      appPath,
      out: 'installers',
      name: file,
      overwrite: true,
      debug: true,
      icon: './src/assets/icons/icon.icns',
    });
  } catch (err) {
    console.log(`Error building DMG ${file}: `, err);
  }
});
