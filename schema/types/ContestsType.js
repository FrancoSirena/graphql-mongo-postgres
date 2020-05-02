const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require("graphql");
const StatusType = require("./StatusType");
const NamesType = require("./NamesType");

const ContestsType = new GraphQLObjectType({
  name: "Contests",
  fields: {
    id: { type: GraphQLID },
    code: { type: new GraphQLNonNull(GraphQLString) },
    status: { type: new GraphQLNonNull(StatusType) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: contest => contest.createdAt.toLocaleString()
    },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    names: {
      type: new GraphQLList(NamesType),
      resolve: (contest, _, { loaders }) =>
        loaders.pg.namesByIds.load(contest.id)
    }
  }
});

module.exports = ContestsType;
