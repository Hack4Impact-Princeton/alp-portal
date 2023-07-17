import NextAuth, { NextAuthOptions, } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import dbConnect from '../../../lib/dbConnect'
import getVolunteerAccountModel, { VolunteerAccount } from '../../../models/VolunteerAccount'
import getAdminAccountModel, { AdminAccount } from '../../../models/AdminAccount'
import mongoose from 'mongoose'
export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {},
            async authorize(credentials, req) {
                const { email, password, isAdmin } = credentials as { email: string, password: string, isAdmin: boolean }
                // weird cast that you have to do because at some point isAdmin goes from being a boolean to a string
                const isAdministrator = isAdmin as unknown == 'true' ? true : false
                await dbConnect()
                let account: VolunteerAccount | AdminAccount | null = null
                if (isAdministrator) {
                    const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel()
                    account = await AdminAccount.findOne({ email: email })
                } else {
                    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel();
                    account = await VolunteerAccount.findOne({ email: email })
                }
                // if none exists then invalid credentials
                if (!account) throw new Error("Invalid email")
                const bcrypt = require("bcryptjs");

                // compare passwords
                const result = await bcrypt.compare(password, account.pwhash);
                if (result) {
                    // name actually contains a string representation of whether the user is an admin or not
                    return {id: email, email: email, name: `${isAdministrator}`, fName: account.fname}
                }
                // if hashed passwords don't match, invalid credentials
                throw new Error("Invalid Password")
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