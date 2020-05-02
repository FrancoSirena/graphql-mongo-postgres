const { GraphQLEnumType } = require("graphql");

const StatusType = new GraphQLEnumType({
  name: "Status",
  values: {
    DRAFT: { value: "draft" },
    PUBLISHED: { value: "published" },
    ARCHIVED: { value: "archived" }
  }
});

module.exports = StatusType;
