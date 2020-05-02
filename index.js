const app = require("express")();
const assert = require("assert");
const DataLoader = require("dataloader");
const { nodeEnv } = require("./util");
const schema = require("./schema/index");
const graphqlHTTP = require("express-graphql");
const pg = require("pg");
const pgdb = require("./database/pgdb");
const { MongoClient } = require("mongodb");
const mongo = require("./config/mongo")[nodeEnv];
const pgConfig = require("./config/pg")[nodeEnv];
const pgPool = new pg.Pool(pgConfig);

let mongoPool;
MongoClient.connect(mongo.url, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null);
  mongoPool = client.db("contests");
  app.use("/graphql", (request, response) => {
    const con = pgdb(pgPool);
    const loaders = {
      usersById: new DataLoader(con.getUsersByIds),
      contestByIds: new DataLoader(con.getContestsByIds),
      namesByIds: new DataLoader(con.getNamesByIds),
      usersByApiKeys: new DataLoader(con.getUsersByApiKeys)
    };
    graphqlHTTP({
      schema,
      graphiql: true,
      context: {
        pg: pgPool,
        mongo: mongoPool,
        loaders
      }
    })(request, response);
  });
});

const PORT = process.env.PORT || 8777;
app.listen(PORT);
