const assert = require("assert");
const { camelCase } = require("./stringFormat");

const camelizeObject = obj =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [camelCase(key)]: value
    }),
    {}
  );

if (require.main === module) {
  assert.deepEqual(
    camelizeObject({
      key_snake: {
        foo: 1
      },
      normal: {
        foo: 2
      },
      fake_lol: {
        baz: 3
      }
    }),
    {
      keySnake: {
        foo: 1
      },
      normal: {
        foo: 2
      },
      fakeLol: {
        baz: 3
      }
    }
  );
}

module.exports = camelizeObject