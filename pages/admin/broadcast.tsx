import { NextPage } from "next";
import { useState } from "react";
import getAdminAccountModel, { AdminAccount } from "../../models/AdminAccount";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../../models/VolunteerAccount";
import mongoose from "mongoose";
import BroadcastForm from "../../components/BroadcastForm";
import getBroadcastModel, { Broadcast } from "../../models/Broadcast";
import { Grid } from "@mui/material";
import BroadcastMessage from "../../components/Broadcast";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import AdminPageContainer from "../../components/AdminPageContainer";
import Navbar from "../../components/AdminNavbar";
import useDynamicPadding from "../../lib/useDynamicPadding";

type BroadcastPageProps = {
  account: AdminAccount;
  volunteers: VolunteerAccount[];
  broadcasts: Broadcast[];
  error: null | string;
  recipient: string | undefined;
  subject: string | undefined;
};
const BroadcastPage: NextPage<BroadcastPageProps> = ({
  account,
  volunteers,
  error,
  broadcasts,
  recipient,
  subject,
}) => {
  const leftPaddingValue = useDynamicPadding(635, 775, "18vw", "18vw", "9vw");
  const [newBroadcasts, setNewBroadcasts] = useState<Broadcast[]>([]);
  const [acctBroadcasts, setAcctBroadcasts] = useState<Broadcast[]>(broadcasts);
  const addBroadcast = (broadcast: Broadcast) => {
    if (!acctBroadcasts.includes(broadcast))
      setAcctBroadcasts((prevBroadcasts) => {
        return [broadcast, ...prevBroadcasts];
      });
    if (!newBroadcasts.includes(broadcast))
      setNewBroadcasts((prevBroadcasts) => {
        return [broadcast, ...prevBroadcasts];
      });
  };

  // console.log("broadcasts", broadcasts)
  return (
    <Grid
      container
      spacing="10"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Grid>
        <Navbar active="broadcast"></Navbar>
      </Grid>

      <Grid style={{ paddingLeft: leftPaddingValue }} item width={"60%"}>
        <h1
          style={{
            color: "#5F5F5F",
            marginRight: 10,
            fontSize: 70,
            fontWeight: 600,
          }}
        >
          BROADCASTS
        </h1>
        <h2
          style={{
            color: "#FE9834",
            marginRight: 10,
            fontSize: 40,
            fontWeight: 600,
          }}
        >
          New Broadcast:
        </h2>
        <BroadcastForm
          email={account.email}
          volunteers={volunteers}
          addBroadcast={addBroadcast}
          recipient={recipient}
          sbjt={subject}
        />
      </Grid>
      <Grid
        item
        style={{ display: "flex", flexDirection: "column", width: "40%" }}
      >
        <h1 style={{ padding: 10, color: "#FE9834" }}>Sent just now:</h1>
        {newBroadcasts &&
          newBroadcasts.map((broadcast) => {
            return <BroadcastMessage broadcast={broadcast} />;
          })}
        <h1 style={{ padding: 10, color: "#FE9834" }}>All broadcasts:</h1>
        {acctBroadcasts &&
          acctBroadcasts.map((broadcast) => {
            return <BroadcastMessage broadcast={broadcast} />;
          })}
      </Grid>

      <div>{error && <p>{error}</p>}</div>
    </Grid>
  );
};

export default BroadcastPage;

export const getServerSideProps = async (context: any) => {
  try {
    const session = await getServerSession(
      context.req,
      context.res,
      authOptions
    );
    if (!session || session.user?.name != "true") {
      return {
        redirect: {
          destination: "../auth/login",
          permanent: false,
        },
      };
    }
    const recipient: string | undefined = context.query.recipient;
    const subject: string | undefined = context.query.subject;
    const AdminAccount: mongoose.Model<AdminAccount> = getAdminAccountModel();
    const account: AdminAccount = (await AdminAccount.findOne({
      email: session.user.email,
    })) as AdminAccount;
    console.log("account", account);
    const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
    const vPromises = account.volunteerIds.map((volunteerId) =>
      VolunteerAccount.findOne({ alp_id: volunteerId })
    );
    const volunteers = (await Promise.all(vPromises)) as VolunteerAccount[];
    console.log("volunteers", volunteers);
    const Broadcast: mongoose.Model<Broadcast> = getBroadcastModel();
    console.log(account.broadcasts);
    const bPromises = account.broadcasts.map((broadcastId) => {
      const res = Broadcast.findOne({ id: broadcastId });
      if (!res) console.log("the bad broadcastId is", broadcastId);
      else return res;
    });
    const broadcasts = (await Promise.all(bPromises)) as Broadcast[];
    return {
      props: {
        error: null,
        account: JSON.parse(JSON.stringify(account)),
        volunteers: JSON.parse(JSON.stringify(volunteers)),
        broadcasts: JSON.parse(JSON.stringify(broadcasts)),
        recipient: recipient ? recipient : null,
        subject: subject ? subject : null,
      },
    };
  } catch (e: Error | any) {
    const errorStr =
      e.message === "Cannot read properties of null (reading 'user')"
        ? "You must login before accessing this page"
        : `${e}`;
    return {
      props: {
        error: errorStr,
        account: null,
        volunteers: null,
        broadcasts: null,
        recipient: null,
        subject: null,
      },
    };
  }
};
