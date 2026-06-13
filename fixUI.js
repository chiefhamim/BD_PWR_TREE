const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const additionalTranslations = `
  // Drill Panel UI
  'Institutional Fact Sheet': 'প্রাতিষ্ঠানিক তথ্য বিবরণী',
  'Status': 'অবস্থা',
  'Headquarters': 'সদর দপ্তর',
  'Operating Jurisdiction': 'পরিচালন এলাকা',
  'Official Portal': 'অফিসিয়াল পোর্টাল',
  'Data Source': 'তথ্য সূত্র',
  'MoPEMR': 'বিদ্যুৎ, জ্বালানি ও খনিজ সম্পদ মন্ত্রণালয়',
  'BPDB Database': 'পিডিবি ডাটাবেস',
  'State-owned power generation companies': 'রাষ্ট্রীয় মালিকানাধীন বিদ্যুৎ উৎপাদন কোম্পানিগুলো',
  'WAPDA Building, Dhaka': 'ওয়াপদা ভবন, ঢাকা',
  'normal': 'স্বাভাবিক',
  'warning': 'সতর্কতা',
  'alert': 'সঙ্কটাপন্ন',
`;

const target = "  'Tariffs exclude VAT and supplementary duties.': 'ট্যারিফে ভ্যাট এবং সম্পূরক শুল্ক অন্তর্ভুক্ত নয়।',";
if (content.includes(target)) {
    content = content.replace(target, target + additionalTranslations);
    fs.writeFileSync(path, content);
    console.log('Added Drill Panel UI translations.');
} else {
    // try to append before }; at the end of DICTIONARY
    const lines = content.split('\n');
    let dictEndIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === '};') {
            dictEndIndex = i;
            break;
        }
    }
    if (dictEndIndex !== -1) {
        lines.splice(dictEndIndex, 0, additionalTranslations);
        fs.writeFileSync(path, lines.join('\n'));
        console.log('Appended Drill Panel UI translations at the end of DICTIONARY.');
    } else {
        console.log('Could not find injection point.');
    }
}
