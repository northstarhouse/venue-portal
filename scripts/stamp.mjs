// Cache-busting: stamps the build time onto the app.js reference in index.html.
import fs from 'fs';
const file = new URL('../index.html', import.meta.url);
const v = Date.now();
const html = fs.readFileSync(file, 'utf8').replace(/assets\/app\.js\?v=\d+/, 'assets/app.js?v=' + v);
fs.writeFileSync(file, html);
console.log('Stamped version', v, 'into index.html');
