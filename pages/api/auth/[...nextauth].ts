import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '../../../lib/dbConnect'
import getVolunteerAccountModel, {VolunteerAccount} from '../../../models/VolunteerAccount'
import mongoose from 'mongoose'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            async authorize(credentials, req) {
                const { email, password } = credentials as { email: string, password: string }
                // goes through all accounts to see if the credentials are correct
                const accounts: VolunteerAccount[] = await getAllAccounts()
                let emailsToPwhashs: { [key: string]: string } = {};
                for (let i = 0; i < accounts.length; i++) {
                    emailsToPwhashs[accounts[i]["email"]] = accounts[i]["pwhash"];
                }
                const bcrypt = require("bcryptjs");
                console.log("Verifying credentials");
                if (
                    email in emailsToPwhashs &&
                    bcrypt.compare(password, emailsToPwhashs[email])
                ) {
                    console.log("Good login");
                    return { email: email, name: "Test", id: email }
                }
                throw new Error("Invalid credentials")

            }
        }),
    ],
    pages: {
        signIn: "/auth/login",
        //error: "auth/error,"
        //signOut: "auth/signOut"
    }
}

const getAllAccounts = async (): Promise<VolunteerAccount[]> => {
    await dbConnect()
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel();
    const volunteerAccounts: VolunteerAccount[] = await VolunteerAccount.find({})
    return volunteerAccounts
}
export default NextAuth(authOptions)