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
    const relativeDir = path.relative(path.dirname(file), '.');
    const prefix = relativeDir === '' ? './' : relativeDir + '/';

    // Replace @/ with correct relative path
    const newContent = content.replace(/from ['"]@\/(.*)['"]/g, (match, p1) => {
        return `from '${prefix}${p1}'`;
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent);
        console.log(`Updated ${file}`);
    }
});
