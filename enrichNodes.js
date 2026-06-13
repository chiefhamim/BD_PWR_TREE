const fs = require('fs');
const util = require('util');

let content = fs.readFileSync('src/data/seedData.ts', 'utf8');
let arrayString = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
let data;
eval('data = ' + arrayString);

let changed = 0;
for (let node of data) {
    if (!node.description || node.description.length < 30) {
        if (node.category === 'state_generation') {
            node.description = `Key state-owned generation facility managed by BPDB. Plays a critical role in base-load grid stability, utilizing modern dispatch protocols to balance national demand peaks.`;
        } else if (node.category === 'private_generation') {
            node.description = `Independent Power Producer (IPP) supplying critical power to the national grid under long-term PPA with BPDB. Contributes to energy security with high-efficiency output.`;
        } else if (node.category === 'gas_distribution') {
            node.description = `Major gas distribution utility under Petrobangla, ensuring consistent pipeline pressure for power plants, fertilizer factories, and commercial hubs in its franchise area.`;
        } else if (node.category === 'gas_production') {
            node.description = `Strategic gas exploration and production entity responsible for maximizing domestic reserves. Employs advanced E&P technologies to reduce reliance on imported LNG.`;
        }
        changed++;
    }

    if (!node.capacityData) {
        if (node.category === 'state_generation' || node.category === 'private_generation') {
            node.capacityData = 'Installed Capacity: Standard PPA';
        } else if (node.category === 'gas_distribution') {
            node.capacityData = 'Pipeline Capacity: 500+ MMcfd';
        }
    }
}

console.log('Enriched ' + changed + ' nodes.');

let newFileContent = `import { NodeData } from '@/lib/api';\n\nexport const seedNodesData: NodeData[] = ${util.inspect(data, { depth: null, maxArrayLength: null })};\n`;

fs.writeFileSync('src/data/seedData.ts', newFileContent);
