const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLInputObjectType,
  GraphQLUnionType
} = require("graphql");
const pgdb = require("../database/pgdb");

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
        loaders.pg.totalVotesByName.load(name.id)
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

const ActivityType = new GraphQLUnionType({
  name: "Activity",
  types: [ContestsType, NamesType],
  resolveType(value) {
    return value.type === "contests" ? ContestsType : NamesType;
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
    },
    activities: {
      type: new GraphQLList(ActivityType),
      resolve: (user, _, { loaders }) =>
        loaders.pg.activitiesForUsersIds.load(user.id)
    }
  }
});

const RootQueryType = new GraphQLObjectType({
  name: "root_query",
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

const ContestInput = new GraphQLInputObjectType({
  name: "ContestInput",
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString }
  }
});

const NamesInput = new GraphQLInputObjectType({
  name: "NamesInput",
  fields: {
    apiKey: { type: new GraphQLNonNull(GraphQLString) },
    label: { type: new GraphQLNonNull(GraphQLString) },
    contestId: { type: new GraphQLNonNull(GraphQLInt) },
    description: { type: GraphQLString }
  }
});

const AddContest = {
  type: ContestsType,
  args: {
    input: { type: new GraphQLNonNull(ContestInput) }
  },
  resolve: (_, { input }, { pgPool }) => pgdb(pgPool).addContest(input)
};

const AddName = {
  type: NamesType,
  args: {
    input: { type: new GraphQLNonNull(NamesInput) }
  },
  resolve: (_, { input }, { pgPool }) => pgdb(pgPool).addName(input)
};

const RootMutationType = new GraphQLObjectType({
  name: "root_mutation",
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
