const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/lib/data/carData.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Use a regex or simple replacement to remove nulls from arrays
// This is a bit tricky with string manipulation but I'll try a regex approach
// Actually, since I have the structure, I can just parse it if I remove the import/export

const jsonPart = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
const data = eval(jsonPart); // Safe here as I wrote the file

function clean(obj) {
  if (Array.isArray(obj)) {
    return obj.filter(item => item !== null).map(clean);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = clean(value);
    }
    return newObj;
  }
  return obj;
}

const cleaned = clean(data);

const newContent = `import { ApifyListing } from './apifyData';

export const cars: ApifyListing[] = ${JSON.stringify(cleaned, null, 2)};
`;

fs.writeFileSync(filePath, newContent);
console.log('Cleaned carData.ts');
