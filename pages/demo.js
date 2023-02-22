const {MongoClient} = require('mongodb');
require("dotenv").config();
const mongoose = require('mongoose');

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const dbURI = "mongodb+srv://hhong:p7ZyC9UjibodJTHl@alp-portal.hh41pen.mongodb.net/?retryWrites=true&w=majority";

console.log(process.env.MONGODB_URI);



/*
async function main() {

    uri =
      "mongodb+srv://hhong:p7ZyC9UjibodJTHl@alp-portal.hh41pen.mongodb.net/?retryWrites=true&w=majority";

    const client = new MongoClient(uri);
    
    try{
        await client.connect();
        const db = await client.db("alp_portal");

        await listDatabases(client);

        console.log(db)
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
    
    
}

main().catch(console.error);

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}
*/