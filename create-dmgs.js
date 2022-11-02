const createDMG = require('electron-installer-dmg');
const fs = require('fs');

// fs.readdirSync('./dist/mac-arm').forEach((file) => {
//   if (file === 'make') return;
//   console.log('Creating DMG for: ', file);
//   createDMG({
//     appPath: `./dist/${file}/Terrarium.app`,
//     out: 'installers',
//     name: file,
//     overwrite: true,
//     debug: true,
//     icon: './src/assets/icons/icon.icns',
//   }, (err) => {
//     console.log(`Error building DMG ${file}: `, err);
//   });
// });

createDMG({
  appPath: './dist/mac-arm64/Terrarium.app',
  out: 'installers',
  name: 'Terrarium',
  overwrite: true,
  debug: true,
  icon: './src/assets/icons/icon.icns',
});
