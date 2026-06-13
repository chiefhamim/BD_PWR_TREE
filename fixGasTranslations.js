const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const gasFixes = {
  "'Domestic গ্যাস Fields': 'Domestic গ্যাস Fields'": "'Domestic Gas Fields': 'দেশীয় গ্যাস ফিল্ড'",
  "'গ্যাস Production': 'গ্যাস Production'": "'Gas Production': 'গ্যাস উৎপাদন'",
  "'গ্যাস fields operation.': 'গ্যাস fields operation.'": "'Gas fields operation.': 'গ্যাস ফিল্ড পরিচালনা'",
  "'Sylhet gas fields.': 'Sylhet gas fields.'": "'Sylhet gas fields.': 'সিলেট গ্যাস ফিল্ড'",
  "'গ্যাস Transmission': 'গ্যাস Transmission'": "'Gas Transmission': 'গ্যাস সঞ্চালন'",
  "'Titas গ্যাস (TGTDPLC)': 'Titas গ্যাস (TGTDPLC)'": "'Titas Gas (TGTDPLC)': 'তিতাস গ্যাস (টিজিটিডিপিএলসি)'",
  "'Titas গ্যাস Bhaban, Kawran Bazar, Dhaka': 'Titas গ্যাস Bhaban, Kawran Bazar, Dhaka'": "'Titas Gas Bhaban, Kawran Bazar, Dhaka': 'তিতাস গ্যাস ভবন, কাওরান বাজার, ঢাকা'",
  "'গ্যাস Distribution': 'গ্যাস Distribution'": "'Gas Distribution': 'গ্যাস বিতরণ'",
  "'Bakhrabad গ্যাস (BGDCL)': 'Bakhrabad গ্যাস (BGDCL)'": "'Bakhrabad Gas (BGDCL)': 'বাখরাবাদ গ্যাস (বিজিডিসিএল)'",
  "'Karnaphuli গ্যাস (KGDCL)': 'Karnaphuli গ্যাস (KGDCL)'": "'Karnaphuli Gas (KGDCL)': 'কর্ণফুলী গ্যাস (কেজিডিসিএল)'",
  "'Jalalabad গ্যাস (JGTDSL)': 'Jalalabad গ্যাস (JGTDSL)'": "'Jalalabad Gas (JGTDSL)': 'জালালাবাদ গ্যাস (জেজিটিডিএসএল)'",
  "'গ্যাস Bhaban, Mendibagh, Sylhet': 'গ্যাস Bhaban, Mendibagh, Sylhet'": "'Gas Bhaban, Mendibagh, Sylhet': 'গ্যাস ভবন, মেন্ডিবাগ, সিলেট'",
  "'Pashchimanchal গ্যাস': 'Pashchimanchal গ্যাস'": "'Pashchimanchal Gas': 'পশ্চিমাঞ্চল গ্যাস'",
  "'Sundarban গ্যাস': 'Sundarban গ্যাস'": "'Sundarban Gas': 'সুন্দরবন গ্যাস'",
  "'National and international gas exploration and production': 'National and international gas exploration and production'": "'National and international gas exploration and production': 'জাতীয় ও আন্তর্জাতিক গ্যাস অনুসন্ধান ও উৎপাদন'",
  "'Regional gas distribution utilities': 'Regional gas distribution utilities'": "'Regional gas distribution utilities': 'আঞ্চলিক গ্যাস বিতরণ ইউটিলিটি'"
};

let matchCount = 0;
for (const [bad, good] of Object.entries(gasFixes)) {
  if (content.includes(bad)) {
    content = content.replace(bad, good);
    matchCount++;
  }
}

fs.writeFileSync(path, content);
console.log('Fixed ' + matchCount + ' specific gas translations.');
