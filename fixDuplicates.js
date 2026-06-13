const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
const seenKeys = new Set();
const newLines = [];

for (let line of lines) {
    const match = line.match(/^\s*'([^']+)':/);
    if (match) {
        const key = match[1];
        if (seenKeys.has(key)) {
            console.log('Removed duplicate key:', key);
            // Skip this line
            continue;
        }
        seenKeys.add(key);
    }
    newLines.push(line);
}

fs.writeFileSync(path, newLines.join('\n'));
