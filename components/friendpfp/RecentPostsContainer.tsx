import React, { useState } from "react";
import Grid from "@mui/material/Grid"; 
import { IconButton,Button, Modal } from "@mui/material";


type PageProps = {
    name: string
};

const RecentPostsContainer: React.FC<PageProps> = ({ name,
  }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () =>
    setTimeout(() => {
      setOpen(false);
    }, 200);

    return (
        <Grid border="1.5px solid red"
        sx={{
            borderRadius:"2px",
            borderWidth:"3px",
            borderColor:"#C9C9C9",
            backgroundColor:"#F5F5F5",
            padding:2,
        }}>
            <Grid container display="flex" alignItems={'center'} flexDirection={"row"} border="1.5px solid red">
              <h2>{name}'s Recent Post</h2>
              <IconButton
                sx={{ backgroundColor: "#FE9834", color: "#FFFFFF",borderRadius:"30px",pl:2,pr:2,ml:1}}
                size={"small"}
                onClick={() => {setOpen(true)
                }}
              >
                <p>more </p>
              </IconButton>
            </Grid>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="recent-post-modal"
              aria-describedby="recent-post-modal"
            >
              <Grid sx={{ 
                  position: "absolute" as "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "50%",
                  bgcolor: "#F5F5F5",
                  border: "2px solid #000",
                  boxShadow: 24,
                  p: 4,}}>
                <p>hey</p>
              </Grid>
            </Modal>
        </Grid>
    )
  }

export default RecentPostsContainer;