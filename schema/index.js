const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInt
} = require("graphql");

const VotesType = new GraphQLObjectType({
  name: "votes",
  fields: () => ({
    down: { type: GraphQLInt },
    up: { type: GraphQLInt }
  })
});

const StatusType = new GraphQLEnumType({
  name: "status",
  values: {
    DRAFT: { value: "draft" },
    PUBLISHED: { value: "published" },
    ARCHIVED: { value: "archived" }
  }
});

const NamesType = new GraphQLObjectType({
  name: "names",
  fields: () => ({
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
        loaders.pg.totalVotesByName.load(name.id).then(res => ({
          up: res.reduce((acc, r) => acc + (r.up ? 1 : 0), 0),
          down: res.reduce((acc, r) => acc + (!r.up ? 1 : 0), 0)
        }))
    }
  })
});

const ContestsType = new GraphQLObjectType({
  name: "contests",
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

const UserType = new GraphQLObjectType({
  name: "UserType",
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
    }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: "start",
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

const schema = new GraphQLSchema({
  query: RootQueryType
});

module.exports = schema;
