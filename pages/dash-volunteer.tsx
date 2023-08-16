import mongoose from 'mongoose'
import Box from '@mui/material/Box';
import PageContainer from '../components/PageContainer';
import DriveCard from '../components/DriveCard'
import Grid2 from '@mui/material/Unstable_Grid2'; // Grid version 2
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button'
import dbConnect from '../lib/dbConnect'
import getBookDriveModel, { BookDrive } from '../models/BookDrive';
import getVolunteerAccountModel, { VolunteerAccount } from '../models/VolunteerAccount';
import { NextPage } from 'next';
import { useState, useRef } from 'react';
import sendReactivationReq from '../db_functions/reactivationReqFns';
import useDynamicPadding from '../lib/useDynamicPadding';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';
import getReactivationRequestModel, { ReactivationRequest } from '../models/ReactivationRequest';
import { TextField } from '@mui/material';
const DashVolunteer: NextPage<{ driveData: { drive: BookDrive | null, reactivationReq: ReactivationRequest | null }[], account: VolunteerAccount | null, error: Error | null }> = ({ driveData, account, error }) => {
  console.log(account)
  const drives = driveData.map(driveDatum => driveDatum.drive)
  console.log("drives", drives)
  const [reactivationReqMessage, setReactivationReqMessage] = useState("")
  const leftPaddingValue = useDynamicPadding(635, 775, "29vw", "20vw", "15vw")
  const newReqModalRef = useRef<HTMLDialogElement>(null)
  const [currDriveCode, setCurrDriveCode] = useState<string>("")
  
  const submitReq = async() => {
    try {
      const response = await sendReactivationReq(currDriveCode, account!.alp_id, reactivationReqMessage)
      if  (!response.success) throw new Error(response.error)
      toggleNewReqModal(false, "")
      alert('Successfully sent request')
    } catch (e: Error | any) {
      if (("message" in e)) alert((e as any).message);
    }
  }

  const toggleNewReqModal = (val: boolean, driveCode: string) => {
    setCurrDriveCode(driveCode)
    if (val) newReqModalRef?.current?.showModal();
    else newReqModalRef?.current?.close()
  }
  if (account) {
    return (
      <Grid2>
        <PageContainer fName={account.fname} currPage="dash-volunteer" ></PageContainer>
        {/* Necessary box for padding the page body, no overlap with Navbar */}
        <Box display="flex" flexDirection="column" sx={{
          pl: leftPaddingValue,
          pt: "5vh",
          pr: "5vw",
          width: '100%',
          justifyContent: "space-between"
        }}>

          <div style={{ fontSize: '25px', textAlign: 'left', marginTop: '2vh', marginBottom: '2vh' }}>Active Drives</div>

          {driveData && <Stack
            direction="column"
            justifyContent="center"
            spacing={6}>

            {driveData.map((driveDatum) => (<>
              <DriveCard drive={driveDatum.drive} reactivationReq={driveDatum.reactivationReq} openNewReqModal={() => toggleNewReqModal(true, driveDatum.drive?.driveCode!)}></DriveCard>
            </>
            ))}
          </Stack>}

          <dialog ref={newReqModalRef} style={{ height: "55%", width: "50%", borderRadius: "3%", padding: 0, position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)"}}>
            <Grid2 display={"flex"} flexDirection={"column"} justifyContent={"space-around"} alignItems={"center"} sx={{backgroundColor: "#F5F5F5", width: "100%", height: "100%", padding: 2}}>
              <p style={{marginBottom: "5px", color: "#FE9834", fontWeight: 600, fontSize: 20}}>Reactivation Request Message for {currDriveCode}</p>
              <TextField multiline autoFocus required placeholder="message" maxRows={9} rows={8} sx={{width: "85%", marginBottom: "5px", backgroundColor: "#FFFFFF", color: "#FE9384", borderColor: "#FE9834"}} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReactivationReqMessage(e.target.value)}/>
              <Grid2 display="flex" flexDirection="row" justifyContent="space-around" alignItems="center" sx={{width: "50%"}}>
                <Button onClick={() => toggleNewReqModal(false, "")} sx={{backgroundColor: "#F3D39A", "&:hover": {backgroundColor: "#D3A874", }, fontWeight: 550, color: '#5F5F5F'}}>Cancel</Button>
                <Button onClick={submitReq} sx={{backgroundColor: "#F3D39A", "&:hover": {backgroundColor: "#D3A874", }, fontWeight: 550, color: '#5F5F5F'}}>Submit</Button>
              </Grid2>
            </Grid2>
          </dialog>
        </Box>
      </Grid2>
    )
  }
  else {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px" }}>
        <h1>{error?.message}</h1>
      </div>
    )
  }
}

export async function getServerSideProps(context: any) {
  try {
    await dbConnect()
    const session = await getServerSession(context.req, context.res, authOptions)
    console.log("SESSION OBJ: ", session);
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
    const VolunteerAccount: mongoose.Model<VolunteerAccount> = getVolunteerAccountModel()
    account = await VolunteerAccount.findOne({ email: email }) as VolunteerAccount
    const BookDrive: mongoose.Model<BookDrive> = getBookDriveModel();
    const driveList = account.driveIds
    const ReactivationRequestModel: mongoose.Model<ReactivationRequest> = getReactivationRequestModel()
    const driveDataPromises: Promise<{ drive: BookDrive, reactivationReq: ReactivationRequest | null }>[] = driveList.map(async (driveId) => {
      const drive = await BookDrive.findOne({ driveCode: driveId }) as BookDrive
      if (!drive) throw new Error(`No drive found with code ${driveId}`)
      if (!drive.reactivationRequestId) return { drive: drive, reactivationReq: null }
      const reactivationReqPromise = await ReactivationRequestModel.findOne({ id: drive.reactivationRequestId })
      const reactivationReq = await Promise.resolve(reactivationReqPromise) as ReactivationRequest
      return { drive: drive, reactivationReq: reactivationReq }
    })
    const driveData = await Promise.all(driveDataPromises)
    console.log("driveData", driveData)
    return { props: { driveData: driveData ? JSON.parse(JSON.stringify(driveData)) : null, account: JSON.parse(JSON.stringify(account)) } }
  } catch (e: Error | any) {
    console.log(e)
    let strError = e.message === "Cannot read properties of null (reading 'user')" ? "You must login before accessing this page" : `${e}`
    return { props: { error: strError } }
  }
}


export default DashVolunteer
