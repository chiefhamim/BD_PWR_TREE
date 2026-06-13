const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const additionalLocationFixes = {
  "'Petrocenter, Dhaka': 'Petrocenter, Dhaka'": "'Petrocenter, Dhaka': 'পেট্রোসেন্টার, ঢাকা'",
  "'Nationwide': 'Nationwide'": "'Nationwide': 'দেশব্যাপী'",
  "'Aftabnagar, Dhaka': 'Aftabnagar, Dhaka'": "'Aftabnagar, Dhaka': 'আফতাবনগর, ঢাকা'",
  "'WAPDA Building, Dhaka': 'WAPDA Building, Dhaka'": "'WAPDA Building, Dhaka': 'ওয়াপদা ভবন, ঢাকা'"
};

let matchCount = 0;
for (const [bad, good] of Object.entries(additionalLocationFixes)) {
  if (content.includes(bad)) {
    content = content.replace(bad, good);
    matchCount++;
  }
}

fs.writeFileSync(path, content);
console.log('Fixed ' + matchCount + ' locations.');
