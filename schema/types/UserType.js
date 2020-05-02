const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLInt
} = require("graphql");
const ActivityType = require("./ActivityType");
const ContestsType = require("./ContestsType");

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    createdAt: {
      type: GraphQLString,
      resolve: user => user.createdAt.toLocaleString()
    },
    fullName: {
      type: GraphQLString,
      resolve: user => `${user.firstName} ${user.lastName}`
    },
    email: { type: new GraphQLNonNull(GraphQLString) },
    contests: {
      type: new GraphQLList(ContestsType),
      resolve: (user, _, { loaders }) => loaders.pg.contestByIds.load(user.id)
    },
    contestsCount: {
      type: GraphQLInt,
      resolve: (user, _, { loaders }, { fieldName }) =>
        loaders.mongo.usersByIds
          .load(user.id)
          .then(({ [fieldName]: result }) => result)
    },
    namesCount: {
      type: GraphQLInt,
      resolve: (user, _, { loaders }, { fieldName }) =>
        loaders.mongo.usersByIds
          .load(user.id)
          .then(({ [fieldName]: result }) => result)
    },
    votesCount: {
      type: GraphQLInt,
      resolve: (user, _, { loaders }, { fieldName }) =>
        loaders.mongo.usersByIds
          .load(user.id)
          .then(({ [fieldName]: result }) => result)
    },
    activities: {
      type: new GraphQLList(ActivityType),
      resolve: (user, _, { loaders }) =>
        loaders.pg.activitiesForUsersIds.load(user.id)
    }
  }
});

module.exports = UserType;
