const fs = require('fs');
const path = require('path');

const folders = [
  'src/components/common',
  'src/components/layout',
  'src/pages/auth',
  'src/pages/organization',
  'src/utils',
];

folders.forEach(folder => {
  const folderPath = path.join(__dirname, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`✅ Created: ${folder}`);
  }
});

console.log('\n✅ All folders created! Now add the files.');