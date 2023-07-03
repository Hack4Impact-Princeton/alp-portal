import { DefaultSession } from 'next-auth'
import { DefaultUser } from 'next-auth'
import { AdminAccount } from '../models/AdminAccount'
import { VolunteerAccount } from '../models/VolunteerAccount'
export interface CustomSession extends DefaultSession {
  user?: {
    name?: string | null
    email?: string | null
    image?: string | null
    isAdmin?: boolean | null
  }
}

export interface VolunteerUser extends VolunteerAccount {
    name?: string | null
    id?: string | null
    isAdmin?: boolean | null
}