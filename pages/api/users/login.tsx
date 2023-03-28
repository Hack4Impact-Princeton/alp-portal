import { connectToDb } from "../../../backend/middleware/database";

const INVALID_CREDENTIALS_ERROR = "Invalid email or password";
const NO_CREDENTIALS_PROVIDED_ERROR = "You must provide an email and password";

export default async function authenticate(email: String, password: String) {
  const db = await connectToDb();
  //const dbURI = "mongodb+srv://hhong:p7ZyC9UjibodJTHl@alp-portal.hh41pen.mongodb.net/?retryWrites=true&w=majority";

  if (!email || !password) throw NO_CREDENTIALS_PROVIDED_ERROR;

  const emailAcc = await db
    .collection("volunteerAccounts")
    .findOne({ email: email });

  if (!emailAcc) throw INVALID_CREDENTIALS_ERROR;
}
