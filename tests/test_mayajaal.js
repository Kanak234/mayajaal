const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

assert.ok(pkg.name, 'Package name must be defined');
assert.ok(fs.existsSync(path.join(root, 'extension.js')), 'extension.js must exist');
console.log('[✓] Mayajaal package and extension manifest validated');
