import { VolunteerAccount } from "../models/VolunteerAccount";
import { useState, useEffect, useRef } from "react";
import { Broadcast } from "../models/Broadcast";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Button,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import RecipientList from "./RecipientList";
import sendBroadcast from "../db_functions/sendBroadcast";
import Link from "next/link";
type BroadcastFormProps = {
  email: string;
  senderName: string;
  volunteers: VolunteerAccount[];
  addBroadcast: (broadcast: Broadcast) => void;
  recipient: string | undefined;
  sbjt: string | undefined;
};



const BroadcastForm: React.FC<BroadcastFormProps> = ({
  email,
  senderName,
  volunteers,
  addBroadcast,
  recipient,
  sbjt,
}) => {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState(sbjt ? sbjt : "");
  const [submit, setSubmit] = useState(false);
  const [showCustomBroadcast, setShowCustomBroadcast] = useState(
    recipient || sbjt ? true : false
  );
  // email addresses of the recipients
  const [recipients, setRecipients] = useState<string[]>(
    recipient ? [recipient] : []
  );
  const sendCustomBroadcast = async () => {
    try {
      setSubmit(true);
      setTimeout(() => {
        setSubmit(false);
      }, 4000);
      const broadcastRes = await sendBroadcast(
        email,
        senderName,
        recipients,
        subject,
        message
      );
      if (!broadcastRes.success) {
        alert(broadcastRes.error.message);
        return;
      }
      addBroadcast(broadcastRes.broadcast);
      setRecipients([]);
      setMessage("");
      setSubject("");

    } catch (e: Error | any) {
      console.error(e);
    }
  };

  const sendAutomatedBroadcast = async () => {
    try {
      const subj = "automated broadcast subject";
      const msg = "automated broadcast message";
      const broadcastRes = await sendBroadcast(email, senderName, recipients, subj, msg);
      if (!broadcastRes.success) {
        alert(broadcastRes.error.message);
        return;
      }
      addBroadcast(broadcastRes.broadcast);
      setRecipients([]);
    } catch (e: Error | any) {
      console.error(e);
    }
  };
  const updateRecipients = (event: any) => {
    if (!recipients.includes(event.target.value))
      setRecipients((prevRecipients) => [
        ...prevRecipients,
        event.target.value,
      ]);
  };
  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((recipient) => recipient !== email));
  };
  const addAllRecipients = () => {
    setRecipients(volunteers.map((volunteer) => volunteer.email));
  };
  const theme = createTheme({
    palette: {
      primary: { main: "#F3D39A" },
    },
  });
  const styles = {
    select: {
      border: "none",
      '&:active': {
        borderColor: '#5F5F5F', // Change the border color on focus
      },
      '&.Mui-focused': {
        borderColor: '#5F5F5F', // Change the border color for the focused state
      },
      height: "40px",
      backgroundColor: "#F3D39A",
      fontFamily: "Epilogue"
    },
    broadcast: {
      fontFamily: "Epilogue",
      backgroundColor: "#F3D39A",
      outline: "none",
      fontSize: "100%",
      marginTop: 2, marginBottom: 4, width: "95%",
      color: "#5F5F5F",
      fontWeight: "bold",
      '&:hover': {
        backgroundColor: "#D3A874",
      },
    },
  };

  return (
    <Grid
      container
      spacing={"10"}
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        padding: 5,
        width: "100%",
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          backgroundColor: "#F5F5F5",
          width: "95%",
          padding: 2,
          paddingTop: 2,
          borderRadius: "7px",
        }}
      >
        <Grid xs={12}>
          <h3 style={{ color: "#5F5F5F", marginBottom: 5 }}>Recipients:</h3>
        </Grid>
        <Grid container style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
        }}>

          <Grid item xs={5} sx={{ mr: "1%" }}>
            <FormControl
              id="volunteer-picker"
              sx={{ width: "100%", justifyContent: "center", outline: 'none', fontFamily: "Epilogue" }}
            >
              {/*<InputLabel id="volunteer-label" sx={{fontFamily:"Epilogue", fontColor:"#5F5F5F"}}>Volunteer</InputLabel>*/}
              <Select sx={styles.select}
                onChange={updateRecipients}
                input={<OutlinedInput sx={{ fontFamily: "Epilogue" }} label="Volunteer" />}
                displayEmpty
              >
                {volunteers.map((volunteer) => (
                  <MenuItem sx={{ fontFamily: "Epilogue" }} key={volunteer.alp_id} value={volunteer.email}>{`${volunteer.fname
                    } ${volunteer.lname.substring(0, 1)}.`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4} sx={{ mr: "1%" }}>
            <Button
              onClick={addAllRecipients}
              style={{
                padding: 5, cursor: "pointer", width: "100%", height: "40px", fontFamily: "Epilogue",
                fontWeight: "bold", color: "#5F5F5F", textTransform: 'none', outline: "none", backgroundColor: "#F3D39A", fontSize: "100%"
              }}
            >
              Add all volunteers
            </Button>
          </Grid>
          <Grid item xs={2.5} sx={{ mr: "1%" }}>
            <Button
              onClick={() => setRecipients([])}
              style={{
                display: "flex",
                width: "100%",
                padding: 5,
                cursor: "pointer",
                height: "40px",
                fontWeight: "bold", color: "#5F5F5F", textTransform: 'none', outline: "none", backgroundColor: "#F3D39A", fontSize: "100%"
              }}
            >
              Clear all
            </Button>
          </Grid>
        </Grid>

        <Grid xs={12}>
          <RecipientList
            recipients={recipients}
            onAddAll={addAllRecipients}
            onClear={() => setRecipients([])}
            onRemove={removeRecipient}
          />
        </Grid>

        <Grid xs={12}> </Grid>
      </Grid>
      {!showCustomBroadcast && (
        <>
          <Button
            variant="contained"
            onClick={sendAutomatedBroadcast}
            sx={styles.broadcast}
          >
            Send Automated Broadcast{" "}
          </Button>
          <Grid
            container
            display="flex"
            sx={{
              flexDirection: "column",
              backgroundColor: "#F5F5F5",
              width: "95%",
              justifyContent: "center",
              alignItems: "center",
              pt: 2,
              pb: 2,
            }}
          >
            <TextField
              required
              error={submit && subject == ""}
              id="subject"
              label="Subject"
              placeholder="subject"
              variant="outlined"
              value={subject}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSubject(e.target.value)
              }
              InputLabelProps={{
                style: {
                  fontFamily: 'Epilogue',
                },
              }}
              sx={{
                mb: 2,
                width: "95%",
                minWidth: "500px",
              }}
            />
            <TextField
              required
              error={submit && message == ""}
              multiline
              minRows={6}
              maxRows={Infinity}
              label="Message"
              aria-label="message"
              placeholder="message"
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMessage(e.target.value)
              }
              InputLabelProps={{
                style: {
                  fontFamily: 'Epilogue',
                },
              }}
              sx={{
                width: "95%", minWidth: "500px", fontFamily: "Epilogue"
              }}
            />
            <Button
              variant="contained"
              onClick={sendCustomBroadcast}
              sx={styles.broadcast}
            >
              Send Custom Broadcast{" "}
            </Button>
          </Grid>

          {/*<Button
            variant="contained"
            onClick={() => setShowCustomBroadcast(true)}
            sx={{ marginTop: 1.5 }}
            color="primary"
          >
            Create Custom Broadcast{" "}
          </Button>*/}
          {/*<Grid
            style={{
              textAlign: "center",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              paddingTop: 10,
            }}
          >
            <Link href="/admin/dashboard">Return to Dashboard</Link>
          </Grid>*/}
        </>
      )}

      {/*{showCustomBroadcast && (
        <Grid
          item
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "90%",
          }}
        >
          <TextField
            required
            error={submit && subject == ""}
            id="subject"
            label="Subject"
            placeholder="subject"
            variant="outlined"
            value={subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSubject(e.target.value)
            }
            sx={{
              mb: 2,
              width: "95%",
              minWidth: "500px",
            }}
          />
          <TextField
            required
            error={submit && message == ""}
            multiline
            minRows={6}
            maxRows={Infinity}
            label="Message"
            aria-label="message"
            placeholder="message"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMessage(e.target.value)
            }
            style={{ width: "95%", minWidth: "500px" }}
          />
          <Button
            variant="contained"
            onClick={sendCustomBroadcast}
            sx={{ marginTop: 1.5 }}
          >
            Send Broadcast{" "}
          </Button>
          <Button
            variant="contained"
            onClick={() => setShowCustomBroadcast(false)}
            sx={{ marginTop: 1.5 }}
          >
            Back
          </Button>
        </Grid>
          )}*/}
    </Grid>
  );
};
export default BroadcastForm;
