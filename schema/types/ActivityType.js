const { GraphQLUnionType } = require("graphql");
const NamesType = require("./NamesType");
const ContestsType = require("./ContestsType");

const ActivityType = new GraphQLUnionType({
  name: "Activity",
  types: [ContestsType, NamesType],
  resolveType(value) {
    return value.type === "contests" ? ContestsType : NamesType;
  }
});

module.exports = ActivityType;
