const orderedFor = require('./orderedFor');

module.exports = pool => ({
  getUsersByIds(ids) {
    return pool
      .collection("users")
      .find({ userId: { $in: ids } })
      .toArray()
      .then(rows =>  orderedFor(rows, ids, 'userId'));
  }
});
