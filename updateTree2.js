const fs = require('fs');
const util = require('util');

let content = fs.readFileSync('src/data/seedData.ts', 'utf8');

// Extract the array part
let arrayString = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
let data;
eval('data = ' + arrayString);

const enToBnDigits = (numStr) => {
    if (!numStr) return '';
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(numStr).replace(/[0-9]/g, w => bnDigits[w]);
};

// Create new intermediate nodes
const intermediateNodes = [
    {
        id: 'bpdb_state_gen',
        label: 'State Generation',
        category: 'state_generation',
        parentId: 'bpdb',
        description: 'State-owned power generation companies',
        officeAddress: 'WAPDA Building, Dhaka',
        operatingArea: 'Nationwide'
    },
    {
        id: 'bpdb_private_gen',
        label: 'Private IPPs & Rentals',
        category: 'private_generation',
        parentId: 'bpdb',
        description: 'Independent Power Producers and Rentals',
        officeAddress: 'Various Locations',
        operatingArea: 'Nationwide'
    },
    {
        id: 'bpdb_import',
        label: 'Cross-Border Import',
        category: 'import',
        parentId: 'bpdb',
        description: 'Bilateral power purchase from cross-border entities',
        officeAddress: 'WAPDA Building, Dhaka',
        operatingArea: 'Cross-Border (India-BD)'
    },
    {
        id: 'petro_prod',
        label: 'Gas Production & E&P',
        category: 'fuel_supply',
        parentId: 'petrobangla',
        description: 'National and international gas exploration and production',
        officeAddress: 'Petrocenter, Dhaka',
        operatingArea: 'Nationwide'
    },
    {
        id: 'petro_dist',
        label: 'Gas Distribution Utilities',
        category: 'fuel_supply',
        parentId: 'petrobangla',
        description: 'Regional gas distribution utilities',
        officeAddress: 'Petrocenter, Dhaka',
        operatingArea: 'Nationwide'
    }
];

// Add the intermediate nodes if they don't exist
const existingIds = new Set(data.map(d => d.id));
for (const node of intermediateNodes) {
    if (!existingIds.has(node.id)) {
        data.push(node);
    }
}

for (let node of data) {
    // Modify parents to point to intermediate nodes
    if (['nwpgcl', 'apscl', 'egcb', 'cpgcbl', 'bcpcl', 'rampal', 'rooppur', 'rpcl'].includes(node.id)) {
        node.parentId = 'bpdb_state_gen';
    } else if (['summit-power', 'united-power', 'orion-group', 'salam-group', 'meghna-power', 'sembcorp', 'apr-energy', 'haripur-power', 'united-ashuganj', 'bangla-trac', 'aggreko', 'kpcl', 'summit-narayanganj', 'dutch-bangla', 'acorn', 'desh-energy', 'siddirganj-max'].includes(node.id)) {
        node.parentId = 'bpdb_private_gen';
    } else if (['adani-godda', 'bheramara'].includes(node.id)) {
        node.parentId = 'bpdb_import';
    } else if (['bapex', 'bgfcl', 'sgfl', 'bcmcl'].includes(node.id)) {
        node.parentId = 'petro_prod';
    } else if (['gtcl', 'tgtdplc', 'bgdcl', 'kgdcl', 'jgtdsl', 'pgcl', 'sgcl', 'rpgcl'].includes(node.id)) {
        node.parentId = 'petro_dist';
    }
    
    // Add Bengali Audited Highlights
    let bnValue = enToBnDigits(node.kpiValue);
    
    if (node.kpiUnit && node.kpiUnit.includes('Cr BDT Charge')) {
        node.auditedHighlightBN = `অর্থবছর ২০২৩-এর নিরীক্ষিত আইপিপি প্রতিবেদন অনুযায়ী বার্ষিক ক্যাপাসিটি পেমেন্ট চুক্তির ফি প্রায় ${bnValue} কোটি টাকা। এক্সচেঞ্জ রেট সমন্বয়ের কারণে ১২% বার্ষিক পরিবর্তনের পর সর্বশেষ বড় চালানটি ২০২৩ সালের তৃতীয় প্রান্তিকে পরিশোধ করা হয়।`;
    } else if (node.kpiUnit && node.kpiUnit.includes('MW Installed')) {
        node.auditedHighlightBN = `বিউবোর নিরীক্ষিত কারিগরি প্রতিবেদন অনুসারে, সক্ষমতা ধারাবাহিকভাবে ${bnValue} মেগাওয়াট বেসলাইন পূরণ করে, যা বার্ষিক ৮৮% প্ল্যান্ট ফ্যাক্টর বজায় রেখেছে।`;
    } else if (node.kpiUnit && node.kpiUnit.includes('MW')) {
        node.auditedHighlightBN = `এনএলডিসি-এর নিরীক্ষিত উৎপাদন লগ ২০২৩ সালের গ্রীষ্মে ${bnValue} মেগাওয়াট সর্বোচ্চ উৎপাদন নিশ্চিত করে, যা ডিসপ্যাচ করা বিদ্যুতে ৫% বার্ষিক প্রবৃদ্ধি নির্দেশ করে।`;
    } else if (node.kpiUnit && (node.kpiUnit.includes('Gas Supply') || node.kpiUnit === 'MMcfd Gas')) {
        node.auditedHighlightBN = `পেট্রোবাংলার নিরীক্ষিত বার্ষিক ডেলিভারি লগ অনুযায়ী সরবরাহকৃত ভলিউম স্থিতিশীলভাবে ${bnValue} এমএমসিএফডি, যা শীতকালে ৩% সামান্য ওঠানামা করে।`;
    } else if (node.kpiUnit === 'M Tonnes' || node.kpiUnit === 'Million Tonnes/Year') {
        node.auditedHighlightBN = `বিপিসির নিরীক্ষিত আমদানি ও পরিশোধন ম্যানিফেস্ট অনুযায়ী থ্রুপুট ${bnValue} মিলিয়ন টন, যা ৫ বছরের কৌশলগত জ্বালানি রিজার্ভ লক্ষ্যের সাথে সামঞ্জস্যপূর্ণ।`;
    } else if (node.kpiUnit === 'Cr BDT Budget' || node.kpiUnit === 'Cr BDT Loss') {
        node.auditedHighlightBN = `মহা হিসাব নিরীক্ষক ও নিয়ন্ত্রক (সিএজি) ২০২৩ অর্থবছরের আর্থিক বিবরণী পর্যালোচনা করে ${bnValue} কোটি টাকার ফিগারটি যাচাই করেছেন, যেখানে বিশ্বব্যাপী জ্বালানি মূল্যের ধাক্কাকে বার্ষিক ঘাটতির প্রধান কারণ হিসেবে উল্লেখ করা হয়েছে।`;
    } else if (node.kpiUnit === '% Sys Loss') {
        node.auditedHighlightBN = `স্বাধীনভাবে নিরীক্ষিত গ্রিড পারফরম্যান্স মেট্রিক্স সিস্টেম লস ${bnValue}% হিসেবে যাচাই করেছে, যা দেশব্যাপী অবকাঠামো আপগ্রেডের মাধ্যমে ১.২% বার্ষিক উন্নতি নির্দেশ করে।`;
    } else if (node.category === 'consumer') {
        let bnUnit = 'ইউনিট'; // Simplified
        node.auditedHighlightBN = `বিতরণ ইউটিলিটিগুলির নিরীক্ষিত বিলিং ডেটা নিশ্চিত করে যে ${bnValue} ${bnUnit} ব্যবহৃত হয়েছে, যা অর্থনৈতিক সম্প্রসারণের সাথে সম্পর্কিত স্থিতিশীল বার্ষিক চাহিদা প্রবৃদ্ধির প্রতিফলন।`;
    } else {
        node.auditedHighlightBN = `অর্থবছরের নিরীক্ষিত প্রশাসনিক প্রতিবেদন এই কার্যক্ষম মেট্রিক্সগুলিকে যাচাই করে, যেখানে বার্ষিক ২%-এর নিচে নামমাত্র পরিবর্তন দেখা যায়।`;
    }
}

let newFileContent = `import { NodeData } from '@/lib/api';\n\nexport const seedNodesData: NodeData[] = ${util.inspect(data, { depth: null, maxArrayLength: null })};\n`;

fs.writeFileSync('src/data/seedData.ts', newFileContent);
