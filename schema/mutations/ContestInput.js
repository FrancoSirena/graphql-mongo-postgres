const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInputObjectType
} = require("graphql");

const ContestInput = new GraphQLInputObjectType({
  name: "ContestInput",
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  }
});

module.exports = ContestInput;
