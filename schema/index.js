const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull
} = require("graphql");
const AddContest = require("./mutations/AddContest");
const AddName = require("./mutations/AddName");
const UserType = require("./types/UserType");

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    me: {
      type: UserType,
      description: "Gets an api key and resolves user associated to it",
      args: {
        key: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve: (_, { key }, { loaders }) => loaders.pg.usersByApiKeys.load(key)
    }
  }
});

const RootMutationType = new GraphQLObjectType({
  name: "RootMutation",
  fields: () => ({
    AddContest,
    AddName
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
});

module.exports = schema;
