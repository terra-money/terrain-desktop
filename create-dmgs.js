const createDMG = require('electron-installer-dmg');
const fs = require('fs');

fs.readdirSync('./out').forEach((file) => {
  if (file === 'make') return;
  console.log('Creating DMG for: ', file);
  createDMG({
    appPath: `./out/${file}/Terrarium.app`,
    out: 'installers',
    name: file,
    overwrite: true,
    debug: true,
    icon: './src/assets/icons/icon.icns',
  }, (err) => {
    console.log(`Error building DMG ${file}: `, err);
  });
});
