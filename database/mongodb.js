module.exports = pool => ({
  getCounts(user, field) {
    return pool
      .collection("users")
      .findOne({ userId: user.id })
      .then(({ [field]: result }) => result);
  }
});
