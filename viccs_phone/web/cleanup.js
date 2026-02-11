const fs = require('fs');
const path = require('path');

const filesToDelete = [
    'components/NeedBar.tsx',
    'components/NeedsPanel.tsx',
    'components/VehicleHUD.tsx',
    'components/WantCard.tsx',
    'components/WantsPanel.tsx',
    'store.ts'
];

const basePath = path.join(__dirname, 'src');

filesToDelete.forEach(file => {
    const filePath = path.join(__dirname, file); // file paths are relative to current dir
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
            console.log(`Deleted: ${filePath}`);
        } catch (e) {
            console.error(`Failed to delete ${filePath}: ${e.message}`);
        }
    } else {
        console.log(`File not found (already deleted): ${filePath}`);
    }
});
