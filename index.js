const assert = require("assert");
const app = require("express")();
const graphqlHTTP = require("express-graphql");
const DataLoader = require("dataloader");
const { nodeEnv } = require("./util");

const pg = require("pg");
const pgdb = require("./database/pgdb");
const pgConfig = require("./config/pg")[nodeEnv];

const { MongoClient } = require("mongodb");
const mongodb = require("./database/mongodb");
const mongo = require("./config/mongo")[nodeEnv];

const schema = require("./schema/index");

MongoClient.connect(mongo.url, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null);
  const pgPool = new pg.Pool(pgConfig);
  const mongoPool = client.db("contests");
  app.use("/graphql", (request, response) => {
    const pgCon = pgdb(pgPool);
    const mongoCon = mongodb(mongoPool);
    const loaders = {
      pg: {
        usersById: new DataLoader(pgCon.getUsersByIds),
        contestByIds: new DataLoader(pgCon.getContestsByIds),
        namesByIds: new DataLoader(pgCon.getNamesByIds),
        usersByApiKeys: new DataLoader(pgCon.getUsersByApiKeys),
        totalVotesByName: new DataLoader(pgCon.getVotesByNames)
      },
      mongo: {
        usersByIds: new DataLoader(mongoCon.getUsersByIds)
      }
    };
    graphqlHTTP({
      schema,
      graphiql: true,
      context: {
        loaders
      }
    })(request, response);
  });
});

const PORT = process.env.PORT || 8777;
app.listen(PORT);
