const { GraphQLNonNull } = require("graphql");

const NamesType = require("../types/NamesType");
const NamesInput = require("./NamesInput");
const pgdb = require("../../database/pgdb");

const AddName = {
  type: NamesType,
  description: 'Adds a new name to a contest',
  args: {
    input: { type: new GraphQLNonNull(NamesInput) }
  },
  resolve: (_, { input }, { pgPool }) => pgdb(pgPool).addName(input)
};

module.exports = AddName;
