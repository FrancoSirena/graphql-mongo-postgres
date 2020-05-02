const camelizeObject = require("../camelizeObject");
const orderedFor = require("./orderedFor");
const { slugify } = require("../stringFormat");

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
  },
  getTotalVotesByNames(names) {
    return pool
      .query(
        ` 
        select * from total_votes_by_count
        where name_id = ANY($1)
        `,
        [names]
      )
      .then(({ rows }) => orderedFor(rows, names, "name_id"));
  },
  getActivitiesForUsersIds(ids) {
    return pool.query(`
      select created_at, created_by, label, '' as title, 'names' as type
      from names
      where created_by = ANY($1)
      union
      select created_at, created_by, '' as label, title, 'contests' as type
      from contests
      where created_by = ANY($1)
    `, [ids]).then(({ rows }) => orderedFor(rows, ids, 'created_by', true))
  },
  addContest({ apiKey, title, description }) {
    return pool
      .query(
        `
      insert into contests(code, title, description, created_by)
      values ($1, $2, $3, (select id from users where api_key = $4))
      returning *
    `,
        [slugify(title), title, description, apiKey]
      )
      .then(({ rows: [row] }) => camelizeObject(row));
  },
  addName({ apiKey, label, contestId, description }) {
    return pool
      .query(
        `
      insert into names(contest_id, label, normalized_label, description, created_by)
      values ($1, $2, $3, $4, (select id from users where api_key = $5))
      returning *
    `,
        [
          contestId,
          label,
          label.toLowerCase().replace(/[\s]+/g, ""),
          description,
          apiKey
        ]
      )
      .then(({ rows: [row] }) => camelizeObject(row));
  }
});
