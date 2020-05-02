const app = require("express")();
const assert = require("assert");
const { nodeEnv } = require("./util");
const schema = require("./schema/index");
const graphqlHTTP = require("express-graphql");
const pg = require("pg");
const { MongoClient } = require("mongodb");
const mongo = require("./config/mongo")[nodeEnv];
const pgConfig = require("./config/pg")[nodeEnv];
const pgPool = new pg.Pool(pgConfig);

let mongoPool;
MongoClient.connect(mongo.url, { useUnifiedTopology: true }, (err, client) => {
  assert.equal(err, null);
  mongoPool = client.db("contests");
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
      context: {
        pg: pgPool,
        mongo: mongoPool
      }
    })
  );
});

const PORT = process.env.PORT || 8777;
app.listen(PORT);
