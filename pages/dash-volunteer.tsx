import mongoose from 'mongoose'
import Box from '@mui/material/Box';
import Navbar from '../components/Navbar'
import DriveCard from '../components/DriveCard'
// import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid'
import dbConnect from '../lib/dbConnect'
import getBookDriveModel, { BookDrive } from '../models/BookDrive';
import Link from 'next/link'
import getVolunteerAccountModel, { VolunteerAccount } from '../models/VolunteerAccount';
import { getSession } from 'next-auth/react';
import { NextPage } from 'next';
import getBroadcastModel, { Broadcast } from '../models/Broadcast';
import { useState, useEffect } from 'react'
import BroadcastMessage from '../components/BroadcastMessage'
type DashVolunteerProps = {
  drives: BookDrive[] | null;
  account: VolunteerAccount | null;
  broadcasts: Broadcast[] | null;
  error: Error | null;
}
interface isReadMapType {
  myMap: Map<string, boolean>
}

const DashVolunteer: NextPage<DashVolunteerProps> = ({ drives, account, error, broadcasts }) => {

  const [expandInbox, setExpandInbox] = useState(false)
  const [isReadMap, setIsReadMap] = useState<isReadMapType>({ myMap: new Map<string, boolean>() })
  const [unreadCounter, setUnreadCounter] = useState(0)
  useEffect(() => {
    broadcasts?.forEach((broadcast) => {
      for (let i = 0; i < broadcast.receiverEmails.length; i++) {
        if (broadcast.receiverEmails[i] === account?.email) {
          const { id, read} = broadcast
          updateIsReadMap(id, read[i])
          break;
        }
      }
    })
  }, [])

  const updateIsReadMap = (broadcastId: string, isRead: boolean) => {
    // if (isRead == true) console.log("adding isRead to " + broadcastId)
    
    setIsReadMap(prevMap => {
      const updatedMap = new Map(prevMap.myMap)
      updatedMap.set(broadcastId, isRead)
      return {myMap: updatedMap }
    })
    if (!isRead) setUnreadCounter(curr => curr+1)
  }

  const markAsRead = async (broadcastId: string, isRead: boolean) => {
    if (isReadMap.myMap.get(broadcastId) != isRead) {
      updateIsReadMap(broadcastId, isRead)
      const res = await fetch(`/api/broadcast/${broadcastId}`, {
        method: "PUT",
        body: JSON.stringify({ email: account?.email, bool: isRead })
      })
      const resJson = await res.json();
      if (res.status != 200) {
        console.log("something went wrong: ", resJson.data)
        return
      }
      else console.log("update: ", resJson.data)
      if (isRead) setUnreadCounter(curr => curr-1)
    }

  }

  if (account) {
    return (
      <Grid container style={{ display: 'flex', flexDirection: "row" }}>
        <Grid item>
          <Navbar active="dash-volunteer" />
        </Grid>
        <Grid item>
          <Box display="flex" flexDirection="column" sx={{
            pl: 20,
            pt: 5,
            pr: 5,
            width: '100%',
            justifyContent: "space-between"
          }} >
            <Box style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <h1 style={{ textAlign: "left", fontSize: "90px", paddingRight: 10 }}>Home</h1>
              {expandInbox ?
                <Box style={{ margin: 15, padding: 10, width: "350px", position: 'absolute', top: 0, right: 0, height: "35%", zIndex: 200, overflowY: "auto", backgroundColor: "#FFFFFF", border: "1.5px solid black" }}>
                  <button style={{ cursor: "pointer" }} onClick={() => setExpandInbox(false)}>Minimize</button>
                  {broadcasts?.map((broadcast) => <BroadcastMessage key={broadcast.id} onRead={markAsRead} isRead={isReadMap.myMap.get(broadcast.id)} broadcast={broadcast} />)}
                </Box>
                :
                <Box onClick={() => setExpandInbox(true)} sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "fit-content", height: "fit-content", padding: 1, border: '1.5px solid gray', cursor: "pointer" }}>
                  <h4 style={{ fontSize: "13px", paddingRight: 3, fontWeight: "1000px" }}>Inbox: </h4>
                  {unreadCounter > 0 && <button style={{ color: "white", backgroundColor: "#e60000", height: "fit-content", width: "fit-content", fontWeight: "1000px" }}>{unreadCounter}</button>}
                </Box>}
            </Box>

            <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh' }}>Active Drives</div>
            <Link href="volunteeraccounts/profile"> Click here to go to your profile
            </Link>
            {drives && <Stack
              direction="column"
              justifyContent="flex-start"
              spacing={10}>
              {drives.map((drive) => (
                <DriveCard key={drive.driveCode} drivename={drive.driveName}></DriveCard>
              ))}
            </Stack>}
          </Box>
        </Grid>
      </Grid>
    )
  }
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        <h1>{error}</h1>
      </div>
    )
  }
}

export async function getServerSideProps(context: any) {
  try {
    await dbConnect()
    const session = await getSession(context)
    if (!session) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false
        }
      }
    }
    if (session.user?.name == 'true') {
      return {
        redirect: {
          destination: '/admin/dashboard',
          permanent: false
        }
      }
    }
    const email = session.user?.email
    let account: VolunteerAccount
    let drives: BookDrive[] | null | undefined = null
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    account = await VolunteerAccount.findOne({ email: email }) as VolunteerAccount
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel();
    const promises = account.driveIds.map(driveId => BookDrive.findOne({ driveCode: driveId }))
    drives = await Promise.all(promises) as BookDrive[]
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel()
    let broadcasts: Broadcast[] | undefined | null = null
    const broadcastPromises = account.broadcasts.map(broadcastId => Broadcast.findOne({ id: broadcastId }))
    broadcasts = await Promise.all(broadcastPromises) as Broadcast[]
    return { props: { drives: drives ? JSON.parse(JSON.stringify(drives)) : null, account: account ? JSON.parse(JSON.stringify(account)) : null, broadcasts: broadcasts ? JSON.parse(JSON.stringify(broadcasts)) : null } }
  } catch (e: Error | any) {
    console.log(e)
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
    return { props: { error: strError } }
  }
}


export default DashVolunteer
