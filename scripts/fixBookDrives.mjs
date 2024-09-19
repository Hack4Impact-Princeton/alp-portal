import { MongoClient } from "mongodb";

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb+srv://dgeng:D9gOMdyBnauqNQEZ@alp-portal.hh41pen.mongodb.net/test";

const client = new MongoClient(uri);
const genUniqueId = () => {
  const dateStr = Date
    .now()
    .toString(36); // convert num to base 36 and stringify

  const randomStr = Math
    .random()
    .toString(36)
    .substring(2, 8); // start at index 2 to skip decimal point

  return `${dateStr}-${randomStr}`;
}

async function run() {
  try {

    // Get the database and collection on which to run the operation
    const database = client.db("alp_portal");
    const accounts = database.collection("bookDrive");

    // Query for a movie that has the title 'The Room'
    // const query = { title: "The Room" };

    // const options = {
    //   // Sort matched documents in descending order by rating
    //   sort: { "imdb.rating": -1 },
    //   // Include only the `title` and `imdb` fields in the returned document
    //   projection: { _id: 0, title: 1, imdb: 1 },
    // };

    const update = {
      $set: {
        fl: {
            shipment: []
          },
       
    }
    }
    // Execute query
    const arr = await accounts.updateMany({}, update);

    // Print the document returned by findOne()
    console.log(arr);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);





