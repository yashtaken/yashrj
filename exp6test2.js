// exp6/test2.js
// usage: node test2.js add 5 3
const op = process.argv[2];
const a = Number(process.argv[3]);
const b = Number(process.argv[4]);

if (!op || isNaN(a) || isNaN(b)) {
  console.log('Usage: node test2.js <add|sub|mul|div> <a> <b>');
  process.exit(1);
}

let result;
switch(op) {
  case 'add': result = a + b; break;
  case 'sub': result = a - b; break;
  case 'mul': result = a * b; break;
  case 'div': result = b === 0 ? 'Error: div by zero' : a / b; break;
  default: result = 'Unknown op';
}
console.log(`Result: ${result}`);
