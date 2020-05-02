const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString
} = require("graphql");
const VotesType = require("./VotesType");

const NamesType = new GraphQLObjectType({
  name: "Names",
  fields: () => {
    const UserType = require("./UserType");
    return {
      id: { type: GraphQLID },
      label: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      createdAt: { type: new GraphQLNonNull(GraphQLString) },
      createdBy: {
        type: new GraphQLNonNull(UserType),
        resolve: (name, _, { loaders }) =>
          loaders.pg.usersById.load(name.createdBy)
      },
      votes: {
        type: VotesType,
        resolve: (name, _, { loaders }) =>
          loaders.pg.totalVotesByName.load(name.id)
      }
    };
  }
});

module.exports = NamesType;
