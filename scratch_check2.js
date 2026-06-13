const fs = require('fs');
const content = fs.readFileSync('src/components/TreeView.tsx', 'utf8');

let lines = content.split('\n');
let opens = 0;
let closes = 0;
for(let i = 0; i < lines.length; i++) {
  let line = lines[i];
  let o = (line.match(/<div/g) || []).length;
  let c = (line.match(/<\/div>/g) || []).length;
  opens += o;
  closes += c;
  if(i >= 430 && i <= 580) {
    if (o || c) console.log(`${i+1}: +${o} -${c} | (Net: ${opens-closes}) | ${line.trim()}`);
  }
}
console.log(`Total Opens: ${opens}, Total Closes: ${closes}`);
