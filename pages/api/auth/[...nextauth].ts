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
                // looks for an account whose email matches
                await dbConnect()
                const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel();
                const account: VolunteerAccount | null = await VolunteerAccount.findOne({email: email})
                // if none exists then invalid credentials
                if (!account) throw new Error("Invalid Credentials")
                const bcrypt = require("bcryptjs");
                console.log("Verifying credentials");
                if (bcrypt.compare(password, account.pwhash)) {
                    console.log("Good login");
                    return { email: email, name: "Test", id: email }
                }   
                // if hashed passwords don't match, invalid credentials
                throw new Error("Invalid Credentials")
            }
        }),
    ],
    pages: {
        signIn: "/auth/login",
        //error: "auth/error,"
        //signOut: "auth/signOut"
    }
}

export default NextAuth(authOptions)