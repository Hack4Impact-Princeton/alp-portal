import { NextPage } from 'next'
import { useState, useEffect } from 'react'
import getAdminAccountModel, { AdminAccount } from '../../models/AdminAccount'
import getVolunteerAccountModel, { VolunteerAccount } from '../../models/VolunteerAccount'
import mongoose from 'mongoose'
import { getSession } from 'next-auth/react'
import BroadcastForm from '../../components/BroadcastForm'
import getBroadcastModel, { Broadcast } from '../../models/Broadcast'
import { Grid, Box } from '@mui/material'
import BroadcastMessage from '../../components/BroadcastMessage'
import { stringify } from 'querystring'
type BroadcastPageProps = {
    account: AdminAccount,
    volunteers: VolunteerAccount[],
    broadcasts: Broadcast[],
    error: string | null
}
interface isReadMapArray {
    myMap: Map<string, { volunteerEmail: string, isRead: boolean }[]>
}
const BroadcastPage: NextPage<BroadcastPageProps> = ({ account, volunteers, error, broadcasts }) => {
    console.log(broadcasts)
    const [newBroadcasts, setNewBroadcasts] = useState<Broadcast[]>([])
    const [acctBroadcasts, setAcctBroadcasts] = useState<Broadcast[]>(broadcasts)
    const addBroadcast = (broadcast: Broadcast) => {
        if (!acctBroadcasts.includes(broadcast)) setAcctBroadcasts(prevBroadcasts => { return [broadcast, ...prevBroadcasts] })
        if (!newBroadcasts.includes(broadcast)) setNewBroadcasts(prevBroadcasts => { return [broadcast, ...prevBroadcasts] })
    }
    const [isReadMap, setIsReadMap] = useState<isReadMapArray>({ myMap: new Map<string, { volunteerEmail: string, isRead: boolean }[]>() })
    useEffect(() => {
        broadcasts?.forEach((broadcast) => {
            for (let i = 0; i < broadcast.receiverEmails.length; i++) {
                const { id, read, receiverEmails } = broadcast
                updateIsReadMap(id, receiverEmails[i], read[i])
            }
        })
    }, [])
    const updateIsReadMap = (broadcastId: string, email: string, isRead: boolean,) => {
        // if (isRead == true) console.log("adding isRead to " + broadcastId)
        setIsReadMap(prevMap => {
            const updatedMap = new Map(prevMap.myMap)
            const existingArr = prevMap.myMap.get(broadcastId)
            let updatedArray: {volunteerEmail: string, isRead: boolean}[]
            if (existingArr) updatedArray = existingArr.map((pair: { volunteerEmail: string, isRead: boolean }) => {return pair})
            else updatedArray = []
            updatedArray.push({ volunteerEmail: email, isRead: isRead })
            updatedMap.set(broadcastId, updatedArray)
            return { myMap: updatedMap }
        })
    }
    // console.log("broadcasts", broadcasts)
    return (
        <Grid container spacing="10" style={{ display: "flex", justifyContent: "space-between" }}>
            <Grid item>
                <BroadcastForm email={account.email} volunteers={volunteers} addBroadcast={addBroadcast} />
            </Grid>
            <Grid item style={{ display: "flex", flexDirection: "column" }}>
                <h1 style={{ padding: 10 }}>Broadcasts sent just now:</h1>
                {newBroadcasts &&
                    newBroadcasts.map(broadcast => {
                        return (
                            <Grid key={broadcast.id} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <BroadcastMessage isVolunteer={false} broadcast={broadcast} />
                                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", height: "fit-content", width: "fit-content", border: "1.5px solid black" }}>
                                    {isReadMap?.myMap?.get(broadcast.id)?.map((pair: { volunteerEmail: string, isRead: boolean }) => <p key={pair.volunteerEmail}>{`${pair.volunteerEmail}: ${pair.isRead ? "read" : "unread"}`}</p>)}
                                    <p>hi</p>
                                </Box>
                            </Grid>
                        )
                    })}
                <h1 style={{ padding: 10 }}>All broadcasts:</h1>
                {acctBroadcasts &&
                    acctBroadcasts.map((broadcast) => {
                        return (
                        <Grid key={broadcast.id} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <BroadcastMessage isVolunteer={false} broadcast={broadcast} />
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "flex-start" }}>
                                <h2 style={{textAlign: "left"}}>Recipient Read Status</h2>
                                {isReadMap?.myMap?.get(broadcast.id)?.map((pair: { volunteerEmail: string, isRead: boolean }) => {return (<p key={pair.volunteerEmail}>{`${pair.volunteerEmail}: ${pair.isRead ? "read" : "unread"}`}</p>)})}
                            </Box>
                        </Grid>)
                    })}
            </Grid>

            <div>
                {error && <p>{error}</p>}
            </div>
        </Grid>
    )
}

export default BroadcastPage

export const getServerSideProps = async (context: any) => {
    try {
        const session = await getSession(context)
        if (!session || session.user?.name != 'true') {
            return {
                redirect: {
                    destination: '../auth/login',
                    permanent: false
                }
            }
        }
        const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel()
        const account: AdminAccount = await AdminAccount.findOne({ email: session.user.email }) as AdminAccount
        console.log("account", account)
        const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
        const vPromises = account.volunteerIds.map(volunteerId => VolunteerAccount.findOne({ alp_id: volunteerId }))
        const volunteers = await Promise.all(vPromises) as VolunteerAccount[]
        console.log("volunteers", volunteers)
        const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel()
        console.log(account.broadcasts)
        const bPromises = account.broadcasts.map(broadcastId => Broadcast.findOne({ id: broadcastId }))
        const broadcasts = await Promise.all(bPromises) as Broadcast[]
        return { props: { error: null, account: JSON.parse(JSON.stringify(account)), volunteers: JSON.parse(JSON.stringify(volunteers)), broadcasts: JSON.parse(JSON.stringify(broadcasts)) } }
    } catch (e: Error | any) {
        const errorStr = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
        return { props: { error: errorStr, account: null, volunteers: null, broadcasts: null } }
    }
}