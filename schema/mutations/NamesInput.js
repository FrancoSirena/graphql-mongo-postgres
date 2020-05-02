const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLInputObjectType
} = require("graphql");

const NamesInput = new GraphQLInputObjectType({
  name: "NamesInput",
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    contestId: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString }
  }
});

module.exports = NamesInput;
