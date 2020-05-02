const { GraphQLNonNull } = require("graphql");
const ContestsType = require("../types/ContestsType");
const ContestInput = require("./ContestInput");
const pgdb = require("../../database/pgdb");

const AddContest = {
  type: ContestsType,
  description: 'Adds a new contest to to associated user',
  args: {
    input: { type: new GraphQLNonNull(ContestInput) }
  },
  resolve: (_, { input }, { pgPool }) => pgdb(pgPool).addContest(input)
};

module.exports = AddContest;
