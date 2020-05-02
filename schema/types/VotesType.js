const {
  GraphQLObjectType, GraphQLInt,
} = require("graphql");

const VotesType = new GraphQLObjectType({
  name: "Votes",
  fields: () => ({
    down: { type: GraphQLInt },
    up: { type: GraphQLInt }
  })
});

module.exports = VotesType;
