import { resolvers } from "./resolvers";
import { makeExecutableSchema } from "graphql-tools";

const typeDefs = /* GraphQL 
    AccountOwner - phone number optional
    AccountOwner - pfp filepath string?
    AccountOwner/Contact - split fname, lname?
    Badge - icon identifier needed if in Contentful?
    BookDrive - status associated with ID with String
*/ `
    # could have the same for request status if feature wanted
    enum DRIVE_STATUS {
        ONGOING
        CANCELLED
        COMPLETED
    }

    type Account {
        id: Int!
        name: String!
        pfp: String!
        email: String!
        ageBucket: Int!
        phoneNum: String
        dateJoined: String
        location: Int!
        bookDrives: Int!
        totalBoxesSent: Int!
        badges: [Int!]!
        textRemind: Boolean!
    }

    type Badge {
        id: Int!
        name: String!
        description: String!
    }

    type BookDrive {
        id: Int!
        organizers: [Int!]!
        startDate: String!
        endDate: String
        booksGoal: Int!
        booksDonated: Int!
        status: Int!
    }

    type Contact {
        id: Int!
        name: String!
        email: String!
        org: Int!
    }

    type Request {
        id: Int!
        requester: Requester!
        booksGoal: Int
        location: Int!
        dateCreated: String!
        dateGoal: String
        description: String!
    }

    type Requester {
        id: Int!
        name: String!
        contacts: [Contact!]!
        location: Int!
        requests: [Request!]!
    }

    type Query {
        accountInfo(id: Int): Account
        getContacts(id: Int): [Contact]
    }

    type Mutation {
        updateAccountInfo(acc_id: Int, field_num: Int, info: String): Account
        updateContact(id: Int, field_num: Int, info: String): Contact
        newAccount(input: Account): Account
        newBadge(input: Badge): [Badge]
        newBookDrive(input: BookDrive): [BookDrive]
        newRequest(input: Request): Request
        newRequester(input: Requester): Request
    }
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
export { schema };