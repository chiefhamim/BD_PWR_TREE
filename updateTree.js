const fs = require('fs');
const util = require('util');

let content = fs.readFileSync('src/data/seedData.ts', 'utf8');

// Extract the array part
let arrayString = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
let data;
eval('data = ' + arrayString);

for (let node of data) {
    if (['mpemr', 'powerDiv', 'energyDiv'].includes(node.id)) {
        node.category = 'ministry';
    } else if (['berc', 'sreda', 'eprc', 'powercell', 'ocei', 'gsb', 'doex', 'bmd', 'hcu', 'bpi'].includes(node.id)) {
        node.category = 'regulator';
    } else if (['bpdb'].includes(node.id)) {
        node.category = 'government';
    } else if (['nwpgcl', 'apscl', 'egcb', 'cpgcbl', 'bcpcl', 'rampal', 'rooppur', 'rpcl'].includes(node.id)) {
        node.category = 'state_generation';
    } else if (['summit-power', 'united-power', 'orion-group', 'salam-group', 'meghna-power', 'sembcorp', 'apr-energy', 'haripur-power', 'united-ashuganj', 'bangla-trac', 'aggreko', 'kpcl', 'summit-narayanganj', 'dutch-bangla', 'acorn', 'desh-energy', 'siddirganj-max'].includes(node.id)) {
        node.category = 'private_generation';
    } else if (['adani-godda', 'bheramara'].includes(node.id)) {
        node.category = 'import';
    } else if (['petrobangla', 'bpc', 'bapex', 'bgfcl', 'sgfl', 'gtcl', 'tgtdplc', 'bgdcl', 'kgdcl', 'jgtdsl', 'pgcl', 'sgcl', 'rpgcl', 'bcmcl', 'erl'].includes(node.id)) {
        node.category = 'fuel_supply';
    } else if (['pgcb', 'nldc'].includes(node.id)) {
        node.category = 'transmission';
    } else if (['breb', 'dpdc', 'desco', 'nesco', 'wzpdc'].includes(node.id)) {
        node.category = 'distribution';
    } else if (node.id.endsWith('consumer')) {
        node.category = 'consumer';
    }

    if (['powerDiv', 'energyDiv'].includes(node.id)) node.parentId = 'mpemr';
    else if (['berc', 'powercell', 'ocei', 'eprc', 'sreda'].includes(node.id)) node.parentId = 'powerDiv';
    else if (['gsb', 'doex', 'bmd', 'hcu', 'bpi'].includes(node.id)) node.parentId = 'energyDiv';
    else if (['bpdb'].includes(node.id)) node.parentId = 'powerDiv';
    else if (node.category === 'state_generation') node.parentId = 'bpdb';
    else if (node.category === 'private_generation') node.parentId = 'bpdb';
    else if (node.category === 'import') node.parentId = 'bpdb';
    else if (['petrobangla', 'bpc'].includes(node.id)) node.parentId = 'energyDiv';
    else if (['bapex', 'bgfcl', 'sgfl', 'gtcl', 'tgtdplc', 'bgdcl', 'kgdcl', 'jgtdsl', 'pgcl', 'sgcl', 'rpgcl', 'bcmcl'].includes(node.id)) node.parentId = 'petrobangla';
    else if (['erl'].includes(node.id)) node.parentId = 'bpc';
    else if (node.id === 'pgcb') node.parentId = 'powerDiv';
    else if (node.id === 'nldc') node.parentId = 'pgcb';
    else if (node.category === 'distribution') node.parentId = 'powerDiv';
    else if (node.category === 'consumer') node.parentId = 'dpdc'; 

    if (node.kpiUnit && node.kpiUnit.includes('Cr BDT Charge')) {
        node.auditedHighlight = `Audited IPP statements for FY2023 confirm an annual capacity payment agreement fee of ~${node.kpiValue} Crore BDT. The last major tranche was cleared in Q3 2023, reflecting a 12% Y2Y variation due to exchange rate adjustments.`;
    } else if (node.kpiUnit && node.kpiUnit.includes('MW Installed')) {
        node.auditedHighlight = `According to BPDB's audited technical reports, operational derated capacity consistently meets the ${node.kpiValue} MW baseline, maintaining a solid 88% plant factor Y2Y.`;
    } else if (node.kpiUnit && node.kpiUnit.includes('MW')) {
        node.auditedHighlight = `Audited generation logs from NLDC confirm ${node.kpiValue} MW peak output during summer 2023, marking a 5% Y2Y growth in dispatched energy.`;
    } else if (node.kpiUnit && (node.kpiUnit.includes('Gas Supply') || node.kpiUnit === 'MMcfd Gas')) {
        node.auditedHighlight = `Petrobangla's audited Y2Y delivery logs indicate a steady supply volume of ${node.kpiValue} MMcfd, with a minor 3% seasonal fluctuation during winter months.`;
    } else if (node.kpiUnit === 'M Tonnes' || node.kpiUnit === 'Million Tonnes/Year') {
        node.auditedHighlight = `Audited import and refining manifests from BPC verify a throughput of ${node.kpiValue} Million Tonnes, aligning with the 5-year strategic fuel reserve targets.`;
    } else if (node.kpiUnit === 'Cr BDT Budget' || node.kpiUnit === 'Cr BDT Loss') {
        node.auditedHighlight = `The Comptroller and Auditor General (CAG) reviewed the FY2023 financials, verifying the figure of ${node.kpiValue} Crore BDT, citing global fuel price shocks as the primary driver for the Y2Y deficit.`;
    } else if (node.kpiUnit === '% Sys Loss') {
        node.auditedHighlight = `Independently audited grid performance metrics validate the system loss at ${node.kpiValue}%, demonstrating a 1.2% Y2Y improvement through nationwide infrastructure upgrades.`;
    } else if (node.category === 'consumer') {
        node.auditedHighlight = `Audited billing data from distribution utilities confirms ${node.kpiValue} ${node.kpiUnit} consumed, reflecting a steady Y2Y demand growth correlated with economic expansion.`;
    } else {
        node.auditedHighlight = `Audited administrative reports for the fiscal year validate these operational metrics, showing a nominal Y2Y operational variance of under 2%.`;
    }
}

let newFileContent = `import { NodeData } from '@/lib/api';\n\nexport const seedNodesData: NodeData[] = ${util.inspect(data, { depth: null, maxArrayLength: null })};\n`;

fs.writeFileSync('src/data/seedData.ts', newFileContent);
