const camelizeObject = require("../camelizeObject");
const orderedFor = require("./orderedFor");

module.exports = pool => ({
  getUsersByIds(ids) {
    return pool
      .query(
        `
        select * from users
        where id = ANY($1)
      `,
        [ids]
      )
      .then(({ rows }) => orderedFor(rows, ids, "id"));
  },
  getUsersByApiKeys(keys) {
    return pool
      .query(
        `
      select * from users
      where api_key = ANY($1)
    `,
        [keys]
      )
      .then(({ rows }) => orderedFor(rows, keys, "api_key"));
  },
  getContestsByIds(ids) {
    return pool
      .query(
        `
      select * from contests
      where created_by = ANY($1)
    `,
        [ids]
      )
      .then(({ rows }) => orderedFor(rows, ids, "created_by", true));
  },
  getNamesByIds(ids) {
    return pool
      .query(
        `
      select * from names
      where contest_id = ANY($1)
      `,
        [ids]
      )
      .then(({ rows }) => orderedFor(rows, ids, "contest_id", true));
  }
});
