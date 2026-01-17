const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next' && file !== '.git' && file !== 'mobile') {
                arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
            }
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const allFiles = getAllFiles('.');

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace @/ with correct relative path
    const newContent = content.replace(/from ['"]@\/(.*)['"]/g, (match, p1) => {
        // Get the directory of the current file
        const fileDir = path.dirname(file);
        // Get the target path (root + the path after @/)
        const targetPath = path.join('.', p1);
        // Calculate relative path from file to target
        let relativePath = path.relative(fileDir, targetPath);

        // Ensure the path starts with ./ or ../
        if (!relativePath.startsWith('.')) {
            relativePath = './' + relativePath;
        }

        // Convert Windows backslashes to forward slashes
        relativePath = relativePath.replace(/\\/g, '/');

        return `from '${relativePath}'`;
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file}`);
    }
});
