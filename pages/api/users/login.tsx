import {connectToDb} from "../../../backend/middleware/database";

const INVALID_CREDENTIALS_ERROR = "Invalid username or password";
const NO_CREDENTIALS_PROVIDED_ERROR =
  "You must provide a username and password";

export default async function authenticate(username: String, password: String) {
    const db = await connectToDb();
    //const dbURI = "mongodb+srv://hhong:p7ZyC9UjibodJTHl@alp-portal.hh41pen.mongodb.net/?retryWrites=true&w=majority";

    if (!username || !password) throw NO_CREDENTIALS_PROVIDED_ERROR;

    const user = await db.collection("users").findOne({"username": username})

    if (!user) throw INVALID_CREDENTIALS_ERROR;

    

  
}
