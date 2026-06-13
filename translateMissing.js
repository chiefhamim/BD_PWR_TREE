const fs = require('fs');

const seedContent = fs.readFileSync('src/data/seedData.ts', 'utf8');
let arrayString = seedContent.substring(seedContent.indexOf('['), seedContent.lastIndexOf(']') + 1);
let data;
eval('data = ' + arrayString);

const langContent = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const missingMap = {};

for (const node of data) {
    const keys = [node.label, node.description, node.officeAddress, node.operatingArea, node.designation];
    for (const key of keys) {
        if (key && !langContent.includes(`'${key}':`) && !langContent.includes(`"${key}":`)) {
            missingMap[key] = key;
        }
    }
}

// Manually provided translations for discovered missing keys based on context:
const bnTranslations = {
    "Sector Coordinator": "সেক্টর সমন্বয়কারী",
    "State Generation": "রাষ্ট্রায়ত্ত উৎপাদন",
    "Private IPPs & Rentals": "বেসরকারি আইপিপি ও রেন্টাল",
    "Cross-Border Import": "আন্তঃদেশীয় বিদ্যুৎ আমদানি",
    "Gas Production & E&P": "গ্যাস উৎপাদন এবং ইএন্ডপি",
    "Gas Distribution Utilities": "গ্যাস বিতরণ ইউটিলিটি",
    "Key state-owned generation facility managed by BPDB. Plays a critical role in base-load grid stability, utilizing modern dispatch protocols to balance national demand peaks.": "বিউবো পরিচালিত রাষ্ট্রীয় মালিকানাধীন প্রধান উৎপাদন কেন্দ্র। আধুনিক ডেসপ্যাচ প্রোটোকল ব্যবহার করে জাতীয় চাহিদার ভারসাম্য বজায় রাখতে এবং বেস-লোড গ্রিড স্থিতিশীলতায় এটি গুরুত্বপূর্ণ ভূমিকা পালন করে।",
    "Independent Power Producer (IPP) supplying critical power to the national grid under long-term PPA with BPDB. Contributes to energy security with high-efficiency output.": "বিউবো'র সাথে দীর্ঘমেয়াদী চুক্তির অধীনে জাতীয় গ্রিডে বিদ্যুৎ সরবরাহকারী আইপিপি। উচ্চ-দক্ষতার মাধ্যমে এটি দেশের জ্বালানি নিরাপত্তায় অবদান রাখে।",
    "Strategic gas exploration and production entity responsible for maximizing domestic reserves. Employs advanced E&P technologies to reduce reliance on imported LNG.": "দেশীয় মজুদ সর্বোচ্চ করতে দায়িত্বপ্রাপ্ত কৌশলগত গ্যাস অনুসন্ধান ও উৎপাদন সংস্থা। আমদানি করা এলএনজির ওপর নির্ভরতা কমাতে উন্নত ইএন্ডপি প্রযুক্তি ব্যবহার করে।",
    "Major gas distribution utility under Petrobangla, ensuring consistent pipeline pressure for power plants, fertilizer factories, and commercial hubs in its franchise area.": "পেট্রোবাংলার অধীনে প্রধান গ্যাস বিতরণ ইউটিলিটি, যা নিজস্ব এলাকায় বিদ্যুৎকেন্দ্র, সার কারখানা এবং বাণিজ্যিক কেন্দ্রগুলোতে সঠিক গ্যাস সরবরাহ নিশ্চিত করে।",
    "1 Abdul Gani Road, Dhaka": "১ আব্দুল গণি রোড, ঢাকা",
    "Nationwide": "দেশব্যাপী",
    "Aftabnagar, Dhaka": "আফতাবনগর, ঢাকা",
    "Titas Gas T&D Co.": "তিতাস গ্যাস টিএন্ডডি কোং",
    "Bakhrabad Gas Distribution Co.": "বাখরাবাদ গ্যাস ডিস্ট্রিবিউশন কোং",
    "Jalalabad Gas T&D System": "জালালাবাদ গ্যাস টিএন্ডডি সিস্টেম",
    "Karnaphuli Gas Distribution Co.": "কর্ণফুলী গ্যাস ডিস্ট্রিবিউশন কোং",
    "Pashchimanchal Gas Co.": "পশ্চিমাঞ্চল গ্যাস কোং",
    "Sundarban Gas Co.": "সুন্দরবন গ্যাস কোং",
    "BGFCL (Bangladesh Gas Fields)": "বিজিএফসিএল (বাংলাদেশ গ্যাস ফিল্ডস)",
    "SGFL (Sylhet Gas Fields)": "এসজিএফএল (সিলেট গ্যাস ফিল্ডস)",
    "BAPEX": "বাপেক্স (বাংলাদেশ পেট্রোলিয়াম এক্সপ্লোরেশন)",
    "Kawran Bazar, Dhaka": "কাওরান বাজার, ঢাকা",
    "Greater Comilla and Noakhali": "বৃহত্তর কুমিল্লা ও নোয়াখালী",
    "Sylhet Region": "সিলেট অঞ্চল",
    "Chittagong Region": "চট্টগ্রাম অঞ্চল",
    "Rajshahi Division": "রাজশাহী বিভাগ",
    "Khulna Division": "খুলনা বিভাগ",
    "Brahmanbaria Region": "ব্রাহ্মণবাড়িয়া অঞ্চল",
    "Doreen Power": "ডরিন পাওয়ার",
    "Baraka Power": "বারাকা পাওয়ার",
    "Shahjibazar Power": "শাহজিবাজার পাওয়ার",
    "Acorn Infrastructure": "অ্যাকর্ন ইনফ্রাস্ট্রাকচার"
};

let additionalDict = `\n  // Dynamically Added Translations\n`;
for (const key of Object.keys(missingMap)) {
    const val = bnTranslations[key] || key;
    // Basic auto-translate for remaining names if not found
    let translatedVal = val;
    if (val === key) {
        translatedVal = val.replace("Plant", "প্ল্যান্ট").replace("Power", "পাওয়ার").replace("Energy", "এনার্জি").replace("Gas", "গ্যাস");
    }
    additionalDict += `  '${key.replace(/'/g, "\\'")}': '${translatedVal.replace(/'/g, "\\'")}',\n`;
}

const targetLine = `'Reset View': 'ভিউ রিসেট',`;
if (langContent.includes(targetLine)) {
    const newContent = langContent.replace(targetLine, targetLine + additionalDict);
    fs.writeFileSync('src/contexts/LanguageContext.tsx', newContent);
    console.log('Successfully injected translations.');
} else {
    console.log('Target line not found for injection.');
}
