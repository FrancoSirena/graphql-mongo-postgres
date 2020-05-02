const assert = require("assert");
const camelizeObject = require("../camelizeObject");

const orderedFor = (rows, args, field, multiple) => {
  const rowsBy = new Map();
  rows.forEach(row => {
    rowsBy.set(row[field], (rowsBy.get(row[field]) || []).concat(row));
  });
  return args.map(value => {
    if (multiple) {
      return (rowsBy.get(value) || []).map(camelizeObject)
    }
    return camelizeObject(rowsBy.get(value)[0] || {})
  });
};

if (require.main === module) {
  assert.deepEqual(
    orderedFor(
      [
        {
          id: "bla",
          value: "foo",
          snake_cased: 'du tazz'
        },
        {
          id: "fuzz",
          value: "faaa"
        },
        {
          id: "foo",
          value: "bla"
        }
      ],
      ["fuzz", "foo", "zyz", "bla"],
      "id"
    ),
    [
      {
        id: "fuzz",
        value: "faaa"
      },
      {
        id: "foo",
        value: "bla"
      },
      {},
      {
        id: "bla",
        value: "foo",
        snakeCased: 'du tazz'
      }
    ]
  );
}

module.exports = orderedFor;
