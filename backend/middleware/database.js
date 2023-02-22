import { MongoClient } from "mongodb";

const dbName = "alp_portal";

// Needs to be changed to process.env.local variable :(
dbURI = "mongodb+srv://iwang:xv4OlU2y8pMFZ4Xx@alp-portal.hh41pen.mongodb.net/?retryWrites=true&w=majority";

export const dbClient = new MongoClient(dbURI/*process.env.DB_URI*/, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const connectToDb = async () => {
  if (!dbClient.isConnected()) await dbClient.connect();
  return dbClient.db(dbName);
};

async function databaseMiddleware(req, res, next) {
  if (!dbClient.isConnected()) await dbClient.connect();
  req.db = dbClient.db(dbName);
  return next();
}

export default databaseMiddleware;
