import Grid2 from "@mui/material/Unstable_Grid2";
import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";
import { Button, IconButton, Modal } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"
import { flagComment } from "../../db_functions/forum";
import { Posts, Comments } from "../../models/Post";



const styles = {
    btn: {
      backgroundColor: "#FE9834",
      width: "45%",
      fontFamily: "Epilogue",
      fontWeight: 'bold',
      color: "white"
    },
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      bgcolor: 'background.paper',
      border: '2px solid #5F5F5F',
      borderRadius: "5px",
      boxShadow: 24,
      p: 4,
      display: "flex",
      flexDirection: "column",
      //minHeight:"30%",
      maxHeight: "70%",
      overflowY: "auto",
      // alignItems:"center",
      //justifyContent:"center",
    },
    flagTextField: {
      width: "100%",
      marginRight: "2rem",
      marginLeft: "0rem",
      marginTop: "1rem",
      marginBottom: "1rem",
      padding: "1rem",
      height: "2.5rem",
      outline: "none !important",
      border: "2px solid #EEEEEE", // TODO, focused outline
    },
    xButton: {

    }

  };

type props={
    comment:Comments;
    post_id:string;
    email:string
    flagged: boolean;
}

const CommentPopover: React.FC<props> = ({
    comment, post_id, email, flagged
  }) => {
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null); // flagging comments popover 
    const popover2 = useRef(null);
    const open2 = Boolean(anchorEl2);
    const id2 = open2 ? 'popover2' : undefined;
    const [showFlagModal, setShowFlagModal] = useState(false)
    const [showFlaggingModal, setShowFlaggingModal] = useState(false)
    const [flagMessage, setFlagMessage] = useState("")




    const handleShowFlagComment = () => {
        setAnchorEl2(anchorEl2 == null ? popover2.current : null);

    };
    const handleCloseFlagComment = () => {
        setAnchorEl2(null);

    };

    return (
    <>
    <Grid2
        container
        xs={1}
        onClick={handleShowFlagComment}
        ref={popover2}
        sx={{position: "absolute", top: 3, right: 0}}
    >
       
    <MoreVertIcon fontSize={"small"}sx={{ position: "absolute", top: 3, right: 0 , cursor:"pointer",color:"#5F5F5F"}} />
        <Popover
        id={id2}
        open={open2}
        anchorEl={anchorEl2}
        onClose={handleCloseFlagComment}
        anchorOrigin={{
            vertical: "top",
            horizontal: "left",
        }}
        style={{ marginTop: "30px" }}
        >
        <div
            style={{
            //marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            //padding: "10px"
            width: "150px",
            }}
        >
            {!flagged && (<button
                key={comment.comment_id}
                onClick={()=>setShowFlaggingModal(true)}
                className={"popover-button"}>
                Flag Comment
            </button>)}
            {flagged && (<button
                key={comment.comment_id}
                onClick={()=>setShowFlagModal(true)}
                className={"popover-button"}>
                Review Flag
            </button>)}

        </div>
        </Popover>

    </Grid2>
    <Modal
                open={showFlagModal} >
                <Grid2 sx={styles.modal}>
                  <Grid2 display="flex" alignItems={"center"} justifyContent={"space-between"}>
                    <h2>Flagged Comment</h2>
                    <IconButton
                      sx={{ position: "absolute", top: 2, right: 4 }}
                      onClick={() => setShowFlagModal(false)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Grid2>
                  <Grid2 sx={{ backgroundColor: "#F5F5F5", borderRadius: "5px", padding: 1, margin: 1, marginBottom: 2 }}>
                    <p style={{ fontWeight: 'bold' }}>Flagged by: <span style={{ fontWeight: 'normal' }}>{comment.flaggerEmail}</span></p>
                    <br></br>
                    <p style={{ fontWeight: 'bold' }}>Flag Reason: <span style={{ fontWeight: 'normal' }}>{comment.flagMessage}</span></p>

                  </Grid2>

                  <Grid2 display="flex" justifyContent={"space-between"}> 
                    <Button sx={styles.btn} onClick={() => { flagComment(false, "", "", post_id, comment.comment_id); setShowFlagModal(false) }}>Unflag Comment</Button>
                    {/* <Button sx={styles.btn} onClick={() => { deletePost(post.post_id); setShowFlagModal(false) }}>Delete Post</Button> */}
                  </Grid2>


                </Grid2>
              </Modal>
        <Modal open={showFlaggingModal} >
              <Grid2 sx={styles.modal}>
                <Grid2 display="flex" alignItems={"center"} justifyContent={"space-between"}>
                  <h2>Flag Post</h2>
                  <IconButton
                    sx={{ position: "absolute", top: 2, right: 4 }}
                    onClick={() => setShowFlaggingModal(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Grid2>



                <input
                  type="text"
                  placeholder="Why would you like to flag this comment?"
                  // TODO should this be resizing, as a textarea instead? input might not be right
                  value={flagMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFlagMessage(e.target.value);
                  }}
                  style={
                    styles.flagTextField
                  }
                />
                <Grid2 display="flex" justifyContent={"space-between"}>
                  <Button sx={styles.btn} onClick={() => { flagComment(true, flagMessage, email, post_id,comment.comment_id); setShowFlaggingModal(false), setFlagMessage("") }}>Confirm Flag Comment</Button>
                </Grid2>
              </Grid2>

            </Modal>
    </>
    
    )
  }
  export default CommentPopover