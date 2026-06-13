const fs = require('fs');
const util = require('util');

let content = fs.readFileSync('src/data/seedData.ts', 'utf8');

// Extract the array part
let arrayString = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
let data;
eval('data = ' + arrayString);

for (let node of data) {
    if (!node.designation) {
        node.designation = 'Sector Coordinator';
    }
    if (!node.status) {
        node.status = 'normal';
    }
}

let newFileContent = `import { NodeData } from '@/lib/api';\n\nexport const seedNodesData: NodeData[] = ${util.inspect(data, { depth: null, maxArrayLength: null })};\n`;

fs.writeFileSync('src/data/seedData.ts', newFileContent);
