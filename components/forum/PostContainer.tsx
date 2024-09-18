import Grid2 from "@mui/material/Unstable_Grid2";
import { Posts, Comments } from "../../models/Post";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SendIcon from "@mui/icons-material/Send";
import { Button, Link, IconButton, TextField, Modal } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentIcon from "@mui/icons-material/Comment";
import CloseIcon from "@mui/icons-material/Close"
import { useState, useRef, useEffect } from "react";
import Popover from "@mui/material/Popover";
import { useRouter } from "next/router";
import FlagIcon from '@mui/icons-material/Flag';
import CommentPopover from "./CommentPopover";

import { nanoid } from "nanoid";
import autoAnimate from "@formkit/auto-animate";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import getVolunteerAccountModel, {
  VolunteerAccount,
} from "../../models/VolunteerAccount";
import RichEditor from "./RichEditor";

import postComment, { deletePost, flagPost } from "../../db_functions/forum";
import { updateSupporterBadge , updateLeader} from "../../db_functions/badges";

type PostProps = {
  post: Posts;
  user?: VolunteerAccount;
  isOwner?: boolean; // TODO note: this should probably be
  // done on a per-post level, so people can del
  // their own posts on any page,
  // but currently this is what matches the design specs
  refreshPosts: (post_id: string,flagged?:boolean) => void;
  email: string;
  username: string;
};

const genRandomDate = () => {
  const emptyDate = new Date();
  const randomDate = new Date();
  const dateFormatter = Intl.DateTimeFormat("sv-SE");
  const formattedRandomDate = dateFormatter.format(
    emptyDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365))
  );
  return formattedRandomDate;
};

const GEN_DUMMY_COMMENTS = (n: number) => {
  let comments: Comments[] = [];
  for (let i = 0; i < n; i++) {
    comments.push({
      email: "email@string.domain",
      date: genRandomDate(),
      text: `
      something very insightul.
      `,
      upvotes: 0,
      downvotes: 0,
      comment_id: nanoid(),
      username: nanoid(4),
    });
  }
  return comments;
};

const PostContainer: React.FC<PostProps> = ({
  post,
  user,
  isOwner,
  refreshPosts,
  username,
  email,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null); // flagging comments popover 
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);



  const [showFlagModal, setShowFlagModal] = useState(false)
  const [showFlaggingModal, setShowFlaggingModal] = useState(false)
  const [flagMessage,setFlagMessage] = useState("")

  const styles = {
    btn: {
      backgroundColor: "#FE9834",
      width: "45%",
      fontFamily:"Epilogue",
      fontWeight:'bold',
      color:"white"
  },
    modal: {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40%',
        bgcolor: 'background.paper',
        border: '2px solid #5F5F5F',
        borderRadius:"5px",
        boxShadow: 24,
        p: 4,
        display:"flex",
        flexDirection:"column",
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
      marginTop:"1rem",
      marginBottom:"1rem",
      padding: "1rem",
      height: "2.5rem",
      outline: "none !important",
      border: "2px solid #EEEEEE", // TODO, focused outline
    },
    xButton: {

    }

};

  const parent = useRef(null);
  const popover = useRef(null);
  const popover2 = useRef(null);

  useEffect(() => {
    //post.comments = GEN_DUMMY_COMMENTS(4);
    // sort the comments by date, most recent at the start
    post.comments.sort((b, a) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, []);

  const addComment = (newComment: Comments) => {
    if (!post.comments.includes(newComment)) {
      post.comments.unshift(newComment);
    }
  };

  const handleViewComments = () => {
    setShowComments(!showComments);
  };

  const handleShowAddComment = () => {
    setShowAddComment(!showAddComment);
  };

  const handleAddComment = () => {
    // TODO hook this up to the auth provider
    // and then push it to the db
    if (!user) return

    const newComment: Comments = {
      email: email,
      date: new Date().toLocaleDateString(),
      text: newCommentText,
      upvotes: 0,
      downvotes: 0,
      comment_id: nanoid(),
      username: username,
    };
    console.log(post.post_id);
    postComment(newComment, post.post_id);
    addComment(newComment);
    updateSupporterBadge(user.email);
    updateLeader(post.email);
    console.log(newComment);

    setNewCommentText("");
  };

  const myPostActions = [
    {
      label: "Delete Post",
      action: () => {
        deletePost(post.post_id);
        refreshPosts(post.post_id);
      },
    },
  ];

  const globalPostActions = [
    {
      label: "Flag Post",
      action: () => {
        setShowFlaggingModal(true)
        //flagPost(true, message, flagger, post.post_id);
        //refreshPosts(post.post_id,true);
      },
    },

  ];
  


  const handleShowCommentActions = () => {
    setAnchorEl(anchorEl == null ? popover.current : null);
  };

  const handleCloseCommentActions = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "popover" : undefined;

  const handleShowFlagComment = (id: string) => () => {
    setAnchorEl2(anchorEl2 == null ? popover2.current : null);
    setCurrentItemId(id);

  };
  const handleCloseFlagComment = () => {
    setAnchorEl2(null);
    setCurrentItemId(null);

  };
  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? 'popover2' : undefined;

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const formatDate = (d: string) => {
    const NATURAL_FORMATTING_DISTANCE = 30 * 6; // 6 months
    const date = Date.parse(d);

    const diff = Math.floor(
      (new Date().getTime() - date) / (24 * 60 * 60 * 1000)
    );

    if (diff <= NATURAL_FORMATTING_DISTANCE) {
      return formatDistance(date, new Date(), { addSuffix: true });
    } else {
      return format(date, "MMMM do, yyyy");
    }
  };

  return (
    <Grid2
      container
      display="flex"
      flexDirection={"column"}
      sx={{ backgroundColor: "#F5F5F5" }}
      style={{ width: "100%" }}
    >
      <Grid2
        container
        display="flex"
        flexDirection={"column"}
        sx={{ padding: 1 }}
      >
        <Grid2
          container
          display="flex"
          sx={{ position: "relative", height: "10vh" }}
        >
          <Grid2
            xs={2}
            container
            display="flex"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >{user && 
            <img src={post.pfpLink} alt="PFP" style={{borderRadius:'50%',width:"75%"}} /> 
            /*TODO: Fix so that this shows the poster's pfp */}
          </Grid2>
          <Grid2
            container
            xs={9}
            display="flex"
            flexDirection={"column"}
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            <h2>{post.username}</h2>
            <p style={{ fontStyle: "italic" }}>{post.date}</p>
          </Grid2>

        {!post.flagged &&  <> 
          <Grid2
            container
            xs={1}
            onClick={handleShowCommentActions}
            ref={popover}
          >
            <MoreVertIcon sx={{ position: "absolute", top: 0, right: 0 , cursor:"pointer"}} />
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseCommentActions}
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
                {isOwner &&
                  myPostActions.map((button, index) => (
                    <button
                      key={index}
                      onClick={button.action}
                      className="popover-button"
                    >
                      {button.label}
                    </button>
                  ))}
                {isOwner && (
                  <svg height="1">
                    <line
                      x1="0"
                      y1="0"
                      x2="100%"
                      y2="0"
                      stroke="gray"
                      strokeWidth="1"
                    />
                  </svg>
                )}
                {globalPostActions.map((button, index) => (
                  <button
                    key={index}
                    onClick={button.action}
                    className={"popover-button"}
                  >
                    {button.label}
                  </button>
                ))}

              </div>
            </Popover>
            
          </Grid2>
          <Modal open={showFlaggingModal} >
              <Grid2 sx={styles.modal}>
              <Grid2 display="flex" alignItems={"center"} justifyContent={"space-between"}>
                  <h2>Flag Post</h2>
                <IconButton
                  sx={{ position: "absolute", top: 2, right: 4 }}
                  onClick={()=>setShowFlaggingModal(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid2>
                
      
                <input
                  type="text"
                  placeholder="Why would you like to flag this post?"
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
                  <Button sx = {styles.btn} onClick={()=>{flagPost(true, flagMessage, email, post.post_id); setShowFlaggingModal(false), setFlagMessage(""),refreshPosts(post.post_id,true)}}>Confirm Flag Post</Button>
                </Grid2>
              </Grid2>

            </Modal>
           </>}
          {post.flagged && (
            <>
            <Grid2
            container
            xs={1}
            ref={popover}
          >
                <IconButton sx={{ position: "absolute", top: 0, right: 0 , cursor:"pointer"}} onClick={()=>setShowFlagModal(true)}>
                <FlagIcon  />
              </IconButton>
            </Grid2>
            <Modal
            open={showFlagModal} >
              <Grid2 sx={styles.modal}>
                <Grid2 display="flex" alignItems={"center"} justifyContent={"space-between"}>
                  <h2>Flagged Post</h2>
                  <IconButton
                  sx={{ position: "absolute", top: 2, right: 4 }}
                  onClick={()=>setShowFlagModal(false)}
                >
                  <CloseIcon />
                </IconButton>
                </Grid2>
                <Grid2 sx={{backgroundColor:"#F5F5F5", borderRadius:"5px",padding:1,margin:1, marginBottom:2}}>
                  <p style={{fontWeight:'bold'}}>Flagged by: <span style={{fontWeight:'normal'}}>{post.flaggerEmail}</span></p>
                  <br></br>
                  <p style={{fontWeight:'bold'}}>Flag Reason: <span style={{fontWeight:'normal'}}>{post.flagMessage}</span></p>

                </Grid2>
                
                <Grid2 display="flex" justifyContent={"space-between"}>
                  <Button sx = {styles.btn} onClick={()=>{flagPost(false, "","", post.post_id); setShowFlagModal(false)}}>Unflag Post</Button>
                  <Button sx = {styles.btn} onClick={()=>{deletePost(post.post_id); setShowFlagModal(false)}}>Delete Post</Button>
                </Grid2>
                

              </Grid2>
            </Modal>
        </>
          )}
          
        </Grid2>
        <Grid2
          sx={{
            backgroundColor: "white",
            margin: 2,
            padding: 2,
          }}
        >

          {/*<p style={{ lineHeight: 1.5 }}>{post.text}</p>*/}
          <RichEditor
            readOnly={true}
            initialValue={post.text}
            onChange={() => {}} // yeah these should be default args
            post_id={post.post_id}
          />

        </Grid2>
      </Grid2>
      <Grid2
        container
        display="flex"
        sx={{ backgroundColor: "white", margin: 0.5 }}
        //style={{ width: "100%" }}
      >
        <div style={{ width: "100%" }}>
          <div ref={parent} style={{ width: "100%" , paddingLeft: "5px"}}>
            <div>
              {/* <IconButton>
                <FavoriteBorderIcon />
              </IconButton> */} 
              <IconButton>
                <CommentIcon onClick={handleShowAddComment} />
              </IconButton>
              <Button
                onClick={handleViewComments}
                style={{
                  color: "gray",
                  fontStyle: "italic",
                  textTransform: "none",
                  textDecoration: "underline",
                  textDecorationColor: "lightgray",
                }}
              >
                {`${showComments ? "Hide" : "View"} all comments`}
              </Button>
            </div>
            {showAddComment && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: "1rem",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <AccountCircleIcon
                  sx={{ fontSize: "4vw" }}
                  style={{
                    color: "#848484", // TODO
                  }}
                />

                {/*<TextField
                        id="outlined-controlled"
                        label=""
                        value={newCommentText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setNewCommentText(e.target.value);
                        }}
                        placeholder="Say something..."
                        style={{
                            width: "100%",
                            marginRight: "2rem",
                            borderRadius: "10000px",
                        }}
                    />*/}
                <input
                  type="text"
                  placeholder="Say something..."
                  // TODO should this be resizing, as a textarea instead? input might not be right
                  value={newCommentText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setNewCommentText(e.target.value);
                  }}
                  style={{
                    width: "100%",
                    marginRight: "2rem",
                    marginLeft: "0rem",
                    borderRadius: "30px",
                    paddingRight: "1rem",
                    paddingLeft: "1rem",
                    height: "2.5rem",
                    outline: "none !important",
                    border: "2px solid #EEEEEE", // TODO
                  }}
                />

                {/*<InputWithIcon />*/}
                <div
                  style={{
                    //move it to be inside the right of the input
                    position: "absolute",
                    right: "1.6rem",
                    //color: "#F5F5F5", // TODO these should be css vars
                    color: "white",
                    backgroundColor: "#F3D39A", // ^^
                    borderRadius: "50%",
                    padding: "0.2rem",
                    width: "1.5rem",
                    height: "1.5rem",
                    textAlign: "center",
                    verticalAlign: "middle",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={handleAddComment}
                >
                  <SendIcon
                    style={{
                      fontSize: "1rem",
                      marginLeft: "0.1rem",
                    }}
                  />
                </div>
              </div>
            )}
            {showComments &&
              post.comments.map((comment) => {
                return (
                  <div
                    key={comment.comment_id}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      margin: "1rem",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{ fontSize: "4vw" }}
                      style={{
                        color: "#848484", // TODO
                      }}
                    />

                    <div
                      style={{
                        backgroundColor: "#F5F5F5",
                        borderRadius: "2px",
                        width: "100%",
                      }}
                    >
                        
                      <Grid2
                        container
                        display="flex"
                        flexDirection="row"
                        sx={{
                          position: "relative",
                        }}
                        paddingX="1rem"
                        paddingTop="1rem"
                      >
                        <CommentPopover key = {comment.comment_id}/>
                        <Grid2
                          container
                          xs={9}
                          display="flex"
                          flexDirection={"column"}
                          sx={{
                            height: "100%",
                            justifyContent: "center",
                          }}
                        >
                          <h2
                            style={{
                              fontSize: "1rem",
                              fontWeight: "bold",
                              color: "#4E4C4C", // TODO
                            }}
                          >
                            {comment.username}
                          </h2>
                          <p
                            style={{
                              fontStyle: "italic",
                              fontSize: "0.8rem",
                              color: "#848484", // TODO
                              marginTop: "6px",
                            }}
                          >
                            {formatDate(comment.date)}
                          </p>
                        </Grid2>
                      </Grid2>
                      <Grid2
                        sx={{
                          padding: 2,
                        }}
                        minWidth="100%"
                      >
                        <p style={{ lineHeight: 1.5 }}>{comment.text}</p>
                      </Grid2>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Grid2>
    </Grid2>
  );
};

export default PostContainer;
