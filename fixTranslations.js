const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  "'Matarbari Power Plant': 'Matarbari পাওয়ার প্ল্যান্ট'": "'Matarbari Power Plant': 'মাতারবাড়ি বিদ্যুৎ কেন্দ্র'",
  "'Rooppur Nuclear Plant': 'Rooppur Nuclear প্ল্যান্ট'": "'Rooppur Nuclear Plant': 'রূপপুর পারমাণবিক বিদ্যুৎ কেন্দ্র'",
  "'Monopolizes domestic gas. Power sector receives only 1050 MMCFD.': 'Monopolizes domestic gas. পাওয়ার sector receives only 1050 MMCFD.'": "'Monopolizes domestic gas. Power sector receives only 1050 MMCFD.': 'দেশীয় গ্যাসের একচেটিয়া নিয়ন্ত্রণকারী। বিদ্যুৎ খাত পায় মাত্র ১০৫০ এমএমসিএফডি।'",
  "'Led by Sec. Mr. Mohammad Saiful Islam. Manages exploration, extraction, processing of fuels.': 'Led by Sec. Mr. Mohammad Saiful Islam. Manages exploration, extraction, processing of fuels.'": "'Led by Sec. Mr. Mohammad Saiful Islam. Manages exploration, extraction, processing of fuels.': 'সচিব জনাব মোহাম্মদ সাইফুল ইসলামের নেতৃত্বে পরিচালিত। জ্বালানি অনুসন্ধান, উত্তোলন এবং প্রক্রিয়াজাতকরণ পরিচালনা করে।'",
  "'Led by Sec. Ms. Farzana Mamtaz. Oversees generation, transmission, and distribution entities.': 'Led by Sec. Ms. Farzana Mamtaz. Oversees generation, transmission, and distribution entities.'": "'Led by Sec. Ms. Farzana Mamtaz. Oversees generation, transmission, and distribution entities.': 'সচিব মিসেস ফারজানা মমতাজের নেতৃত্বে পরিচালিত। বিদ্যুৎ উৎপাদন, সঞ্চালন এবং বিতরণ সংস্থাগুলোর তদারকি করে।'",
  "'Barapukuria Coal': 'Barapukuria Coal'": "'Barapukuria Coal': 'বড়পুকুরিয়া কয়লা খনি'",
  "'Coal Mining': 'Coal Mining'": "'Coal Mining': 'কয়লা খনি'",
  "'Tonnes': 'Tonnes'": "'Tonnes': 'টন'",
  "'Barapukuria': 'Barapukuria'": "'Barapukuria': 'বড়পুকুরিয়া'",
  "'Dinajpur': 'Dinajpur'": "'Dinajpur': 'দিনাজপুর'",
  "'Meghna Power Ltd': 'Meghna পাওয়ার Ltd'": "'Meghna Power Ltd': 'মেঘনা পাওয়ার লিমিটেড'",
  "'Rural Power Co. Ltd': 'Rural পাওয়ার Co. Ltd'": "'Rural Power Co. Ltd': 'রুরাল পাওয়ার কোম্পানি লিমিটেড'",
  "'Haripur Power Ltd': 'Haripur পাওয়ার Ltd'": "'Haripur Power Ltd': 'হরিপুর পাওয়ার লিমিটেড'",
  "'Bangla Trac Power Unit-1': 'Bangla Trac পাওয়ার Unit-1'": "'Bangla Trac Power Unit-1': 'বাংলা ট্র্যাক পাওয়ার ইউনিট-১'",
  "'Khulna Power Co': 'Khulna পাওয়ার Co'": "'Khulna Power Co': 'খুলনা পাওয়ার কোম্পানি'",
  "'Rental Plant': 'Rental প্ল্যান্ট'": "'Rental Plant': 'রেন্টাল বিদ্যুৎ কেন্দ্র'",
  "'APR Energy': 'APR এনার্জি'": "'APR Energy': 'এপিআর এনার্জি'",
  "'United Ashuganj Energy': 'United Ashuganj এনার্জি'": "'United Ashuganj Energy': 'ইউনাইটেড আশুগঞ্জ এনার্জি'",
  "'Power Cell': 'পাওয়ার Cell'": "'Power Cell': 'পাওয়ার সেল'",
  "'Energy & Power Research Council': 'এনার্জি & পাওয়ার Research Council'": "'Energy & Power Research Council': 'এনার্জি অ্যান্ড পাওয়ার রিসার্চ কাউন্সিল'"
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replace(bad, good);
}

fs.writeFileSync(path, content);
console.log('Fixed specific bad translations.');
