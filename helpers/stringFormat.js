const assert = require('assert');
const snakeCase = str => [...str].map(c => c === c.toUpperCase() ? `_${c.toLowerCase()}`: c).join('');
const camelCase = str => str.split('_').map((str, i) => i > 0 ? `${str.slice(0,1).toUpperCase()}${str.slice(1)}`: str).join('')
const slugify = str => str.toLowerCase().replace(/[\s\W-]+/g, '-')

if (require.main === module) {
  assert.equal(snakeCase('francoCanaleSirenaSuper'), 'franco_canale_sirena_super')
  assert.equal(camelCase('franco_canale_sirena_super'), 'francoCanaleSirenaSuper')
  assert.equal(slugify('Franco Canale Sirena Super'), 'franco-canale-sirena-super');
}

module.exports = {snakeCase, camelCase, slugify};