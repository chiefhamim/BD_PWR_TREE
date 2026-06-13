const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');
const seenKeys = new Set();
const newLines = [];

let inDictionary = false;

for (let line of lines) {
    if (line.includes('const DICTIONARY: Record<string, string> = {')) {
        inDictionary = true;
    } else if (inDictionary && line === '};') {
        inDictionary = false;
    }

    if (inDictionary) {
        const match = line.match(/^\s*'([^']+)':/);
        if (match) {
            const key = match[1];
            if (seenKeys.has(key)) {
                console.log('Removed dictionary duplicate key:', key);
                // Skip this line
                continue;
            }
            seenKeys.add(key);
        }
    }
    newLines.push(line);
}

fs.writeFileSync(path, newLines.join('\n'));
