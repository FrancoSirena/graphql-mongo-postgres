## GraphQL + NodeJS + MongoDB + Postgres + Docker

Server implementation in NodeJS using GraphQL. The content shown here was based
on this course
https://app.pluralsight.com/library/courses/graphql-scalable-apis/table-of-contents

We set two databases, one in `Postgres` and the other on `MongoDB`

Both databases and its base data are served with docker, so just download the
repo and, having docker-compose installed, you can just run it:
- `docker-compose -f docker-compose-db.yml up`

To run the server just use regular node commands:
- npm install
- npm start

### Folder Structure
#### Docker
Docker related files
#### Database
Database clients with all methods to read or write to both dbs.
#### Helpers
Some methods that I've written just because I didn't want to add lodash or whatever, and they are simple enough so I just did it.
#### Schema
GraphQL related files, here we have everything
##### Types
All GraphQL custom types that we are using
##### Mutations
Our two mutations to add names and contests


