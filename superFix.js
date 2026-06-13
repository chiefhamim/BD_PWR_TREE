const fs = require('fs');
const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const fixes = {
  "'Domestic Gas Fields': 'Domestic গ্যাস Fields'": "'Domestic Gas Fields': 'দেশীয় গ্যাস ফিল্ড'",
  "'Gas Production': 'গ্যাস Production'": "'Gas Production': 'গ্যাস উৎপাদন'",
  "'Gas fields operation.': 'গ্যাস fields operation.'": "'Gas fields operation.': 'গ্যাস ফিল্ড পরিচালনা'",
  "'Gas Transmission': 'গ্যাস Transmission'": "'Gas Transmission': 'গ্যাস সঞ্চালন'",
  "'Titas Gas (TGTDPLC)': 'Titas গ্যাস (TGTDPLC)'": "'Titas Gas (TGTDPLC)': 'তিতাস গ্যাস (টিজিটিডিপিএলসি)'",
  "'Titas Gas Bhaban, Kawran Bazar, Dhaka': 'Titas গ্যাস Bhaban, Kawran Bazar, Dhaka'": "'Titas Gas Bhaban, Kawran Bazar, Dhaka': 'তিতাস গ্যাস ভবন, কাওরান বাজার, ঢাকা'",
  "'Gas Distribution': 'গ্যাস Distribution'": "'Gas Distribution': 'গ্যাস বিতরণ'",
  "'Bakhrabad Gas (BGDCL)': 'Bakhrabad গ্যাস (BGDCL)'": "'Bakhrabad Gas (BGDCL)': 'বাখরাবাদ গ্যাস (বিজিডিসিএল)'",
  "'Karnaphuli Gas (KGDCL)': 'Karnaphuli গ্যাস (KGDCL)'": "'Karnaphuli Gas (KGDCL)': 'কর্ণফুলী গ্যাস (কেজিডিসিএল)'",
  "'Jalalabad Gas (JGTDSL)': 'Jalalabad গ্যাস (JGTDSL)'": "'Jalalabad Gas (JGTDSL)': 'জালালাবাদ গ্যাস (জেজিটিডিএসএল)'",
  "'Gas Bhaban, Mendibagh, Sylhet': 'গ্যাস Bhaban, Mendibagh, Sylhet'": "'Gas Bhaban, Mendibagh, Sylhet': 'গ্যাস ভবন, মেন্ডিবাগ, সিলেট'",
  "'Pashchimanchal Gas': 'Pashchimanchal গ্যাস'": "'Pashchimanchal Gas': 'পশ্চিমাঞ্চল গ্যাস'",
  "'Sundarban Gas': 'Sundarban গ্যাস'": "'Sundarban Gas': 'সুন্দরবন গ্যাস'",
  "'Desh Energy': 'Desh এনার্জি'": "'Desh Energy': 'দেশ এনার্জি'",
  "'Siddirganj Max Power': 'Siddirganj Max পাওয়ার'": "'Siddirganj Max Power': 'সিদ্ধিরগঞ্জ ম্যাক্স পাওয়ার'",
  "'Siddhirganj, Narayanganj': 'Siddhirganj, Narayanganj'": "'Siddhirganj, Narayanganj': 'সিদ্ধিরগঞ্জ, নারায়ণগঞ্জ'",
  "'Siddhirganj': 'Siddhirganj'": "'Siddhirganj': 'সিদ্ধিরগঞ্জ'",
  "'Petrocentre, 3 Kawran Bazar, Dhaka 1215': 'Petrocentre, 3 Kawran Bazar, Dhaka 1215'": "'Petrocentre, 3 Kawran Bazar, Dhaka 1215': 'পেট্রোসেন্টার, ৩ কাওরান বাজার, ঢাকা ১২১৫'",
  "'Domestic exploration.': 'Domestic exploration.'": "'Domestic exploration.': 'দেশীয় অনুসন্ধান'",
  "'BAPEX Bhaban, Kawran Bazar, Dhaka': 'BAPEX Bhaban, Kawran Bazar, Dhaka'": "'BAPEX Bhaban, Kawran Bazar, Dhaka': 'বাপেক্স ভবন, কাওরান বাজার, ঢাকা'",
  "'BGFCL': 'BGFCL'": "'BGFCL': 'বিজিএফসিএল'",
  "'Birashar, Brahmanbaria': 'Birashar, Brahmanbaria'": "'Birashar, Brahmanbaria': 'বিরাশার, ব্রাহ্মণবাড়িয়া'",
  "'Brahmanbaria Fields': 'Brahmanbaria Fields'": "'Brahmanbaria Fields': 'ব্রাহ্মণবাড়িয়া ফিল্ডস'",
  "'SGFL': 'SGFL'": "'SGFL': 'এসজিএফএল'",
  "'Haripur, Sylhet': 'Haripur, Sylhet'": "'Haripur, Sylhet': 'হরিপুর, সিলেট'",
  "'Sylhet Fields': 'Sylhet Fields'": "'Sylhet Fields': 'সিলেট ফিল্ডস'",
  "'GTCL': 'GTCL'": "'GTCL': 'জিটিসিএল'",
  "'High-pressure national transmission.': 'High-pressure national transmission.'": "'High-pressure national transmission.': 'উচ্চ-চাপ জাতীয় সঞ্চালন'",
  "'GTCL Bhaban, Agargaon, Dhaka': 'GTCL Bhaban, Agargaon, Dhaka'": "'GTCL Bhaban, Agargaon, Dhaka': 'জিটিসিএল ভবন, আগারগাঁও, ঢাকা'",
  "'National Transmission Network': 'National Transmission Network'": "'National Transmission Network': 'জাতীয় সঞ্চালন নেটওয়ার্ক'",
  "'Dhaka & industrial belts.': 'Dhaka & industrial belts.'": "'Dhaka & industrial belts.': 'ঢাকা এবং শিল্পাঞ্চল'",
  "'Greater Dhaka and surrounding industrial belts': 'Greater Dhaka and surrounding industrial belts'": "'Greater Dhaka and surrounding industrial belts': 'বৃহত্তর ঢাকা এবং সংলগ্ন শিল্পাঞ্চল'",
  "'Cumilla and Noakhali.': 'Cumilla and Noakhali.'": "'Cumilla and Noakhali.': 'কুমিল্লা এবং নোয়াখালী'",
  "'Chapapur, Cumilla': 'Chapapur, Cumilla'": "'Chapapur, Cumilla': 'চাপাপুর, কুমিল্লা'",
  "'Cumilla and Noakhali regions': 'Cumilla and Noakhali regions'": "'Cumilla and Noakhali regions': 'কুমিল্লা এবং নোয়াখালী অঞ্চল'",
  "'Chattogram region.': 'Chattogram region.'": "'Chattogram region.': 'চট্টগ্রাম অঞ্চল'",
  "'Sholashahar, Chattogram': 'Sholashahar, Chattogram'": "'Sholashahar, Chattogram': 'ষোলশহর, চট্টগ্রাম'",
  "'Chattogram region': 'Chattogram region'": "'Chattogram region': 'চট্টগ্রাম অঞ্চল'",
  "'Sylhet region.': 'Sylhet region.'": "'Sylhet region.': 'সিলেট অঞ্চল'",
  "'Sylhet region': 'Sylhet region'": "'Sylhet region': 'সিলেট অঞ্চল'",
  "'Northwestern region.': 'Northwestern region.'": "'Northwestern region.': 'উত্তর-পশ্চিমাঞ্চল'",
  "'Nalka, Sirajganj': 'Nalka, Sirajganj'": "'Nalka, Sirajganj': 'নলকা, সিরাজগঞ্জ'",
  "'Northwestern regions': 'Northwestern regions'": "'Northwestern regions': 'উত্তর-পশ্চিমাঞ্চল'",
  "'Southwestern region.': 'Southwestern region.'": "'Southwestern region.': 'দক্ষিণ-পশ্চিমাঞ্চল'",
  "'Boyra, Khulna': 'Boyra, Khulna'": "'Boyra, Khulna': 'বয়রা, খুলনা'",
  "'Southwestern regions': 'Southwestern regions'": "'Southwestern regions': 'দক্ষিণ-পশ্চিমাঞ্চল'",
  "'RPGCL (LNG)': 'RPGCL (LNG)'": "'RPGCL (LNG)': 'আরপিজিসিএল (এলএনজি)'",
  "'Manages Moheshkhali FSRUs. Highly exposed to spot market volatility.': 'Manages Moheshkhali FSRUs. Highly exposed to spot market volatility.'": "'Manages Moheshkhali FSRUs. Highly exposed to spot market volatility.': 'মহেশখালী এফএসআরইউ পরিচালনা করে। স্পট মার্কেটের অস্থিরতার প্রতি অত্যন্ত সংবেদনশীল।'",
  "'RPGCL Head Office, Nikunja-2, Dhaka': 'RPGCL Head Office, Nikunja-2, Dhaka'": "'RPGCL Head Office, Nikunja-2, Dhaka': 'আরপিজিসিএল প্রধান কার্যালয়, নিকুঞ্জ-২, ঢাকা'",
  "'Moheshkhali Floating LNG Terminals': 'Moheshkhali Floating LNG Terminals'": "'Moheshkhali Floating LNG Terminals': 'মহেশখালী ভাসমান এলএনজি টার্মিনাল'",
  "'Monopolized domestic coal mining.': 'Monopolized domestic coal mining.'": "'Monopolized domestic coal mining.': 'দেশীয় কয়লা খনির একচেটিয়া নিয়ন্ত্রণ।'",
  "'Barapukuria, Parbatipur, Dinajpur': 'Barapukuria, Parbatipur, Dinajpur'": "'Barapukuria, Parbatipur, Dinajpur': 'বড়পুকুরিয়া, পার্বতীপুর, দিনাজপুর'",
  "'BPC': 'BPC'": "'BPC': 'বিপিসি'",
  "'Imports crude oil and refined petroleum.': 'Imports crude oil and refined petroleum.'": "'Imports crude oil and refined petroleum.': 'অশোধিত তেল এবং পরিশোধিত পেট্রোলিয়াম আমদানি করে।'",
  "'BSCIC Building, Agrabad, Chattogram': 'BSCIC Building, Agrabad, Chattogram'": "'BSCIC Building, Agrabad, Chattogram': 'বিসিক ভবন, আগ্রাবাদ, চট্টগ্রাম'",
  "'Summit Narayanganj': 'Summit Narayanganj'": "'Summit Narayanganj': 'সামিট নারায়ণগঞ্জ'"
};

let matchCount = 0;
for (const [bad, good] of Object.entries(fixes)) {
  if (content.includes(bad)) {
    content = content.replace(bad, good);
    matchCount++;
  } else {
    // try exact regex for left side
    const parts = bad.split("': '");
    if (parts.length === 2) {
      const regexStr = parts[0] + "':\\s*'" + parts[1];
      const regex = new RegExp(regexStr);
      if (regex.test(content)) {
        content = content.replace(regex, good);
        matchCount++;
      }
    }
  }
}

fs.writeFileSync(path, content);
console.log('Fixed ' + matchCount + ' bad translations via superFix.');
