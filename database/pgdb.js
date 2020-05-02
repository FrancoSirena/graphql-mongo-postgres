const camelizeObject = require("../camelizeObject");
const orderedFor = require('./orderedFor');

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
      .then(({ rows }) => orderedFor(rows, ids, 'id'));
  },
  getUsers(keys) {
    return pool
      .query(
        `
      select * from users
      where api_key = ANY($1)
    `,
        [keys]
      )
      .then(({ rows }) => orderedFor(rows, keys, 'api_key')); 
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
      .then(({ rows }) => orderedFor(rows, ids, 'created_by', true));
  },

  getUser(key) {
    return pool
      .query(
        `
      select * from users
      where api_key = $1
    `,
        [key]
      )
      .then(({ rows: [row] }) => camelizeObject(row));
  },
  getUserById(key) {
    return pool
      .query(
        `
      select * from users
      where id = $1
    `,
        [key]
      )
      .then(({ rows: [row] }) => camelizeObject(row));
  },
  getContests(user) {
    return pool
      .query(
        `
      select * from contests
      where created_by = $1
    `,
        [user.id]
      )
      .then(({ rows }) => rows.map(camelizeObject));
  },
  getNames(contest) {
    return pool
      .query(
        `
      select * from names
      where contest_id = $1
    `,
        [contest.id]
      )
      .then(({ rows }) => rows.map(camelizeObject));
  }
});
