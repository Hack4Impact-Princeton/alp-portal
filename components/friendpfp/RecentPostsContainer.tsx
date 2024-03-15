import React, { useState } from "react";
import Grid from "@mui/material/Grid"; 
import { IconButton,Button, Modal } from "@mui/material";
import { Posts } from "../../models/Post";
import RichEditor from "../forum/RichEditor";
import PostContainer from "../forum/PostContainer";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Grid2 from "@mui/material/Unstable_Grid2";


type PageProps = {
    name: string
    posts?: Posts[]
};

const RecentPostsContainer: React.FC<PageProps> = ({ name,posts
  }) => {
    const [open, setOpen] = useState(false);
    const handleClose = () =>
    setTimeout(() => {
      setOpen(false);
    }, 200);


    return (
        <Grid border="1.5px solid red"
        sx={{
            borderRadius:"5px",
            borderWidth:"1.5px",
            borderColor:"#C9C9C9",
            backgroundColor:"#F5F5F5",
            padding:2,
        }}>
            <Grid container display="flex" alignItems={'center'} flexDirection={"row"} >
              <h2>{name}'s Recent Posts </h2>
              <IconButton
                sx={{ backgroundColor: "#FE9834", color: "#FFFFFF",borderRadius:"30px",pl:2,pr:2,ml:1}}
                size={"small"}
                onClick={() => {setOpen(true)
                }}
              >
                <p>more{'>'}</p>
              </IconButton>
            </Grid>
            {posts && (<div>
              <Grid sx={{ backgroundColor: "white", alignItems:"center",mt:1,p:2, maxHeight: "150px", overflowY: "auto"}}>
              <p style={{fontStyle:"italic",marginBottom:-5}}>{posts[0].date}:</p>
              <Grid sx={{height:"100%", p:0, m:0}}>
              <RichEditor
                readOnly={true}
                initialValue={posts[0].text}
                onChange={() => {}} 
                post_id={posts[0].post_id}
              />
              </Grid>
              
            </Grid>
              <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="recent-post-modal"
              aria-describedby="recent-post-modal"
            >
              <Grid sx={{ 
                  position: "absolute" as "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "50%",
                  bgcolor: "#F5F5F5",
                  border: "2px solid #000",
                  borderRadius:"5px",
                  boxShadow: 24,
                  p: 2, pt:4}}>
                <PostCarousel name={name} posts={posts}/>
              </Grid>
            </Modal>
            </div>
            
            
            )}
            
        </Grid>
    )
  }
type CarouselProps = {
  name:string
  posts:Posts[]
}
const PostCarousel: React.FC<CarouselProps> = ({ name,posts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNextSlide = () => {
    const newIndex = currentIndex === posts.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToPrevSlide = () => {
    const newIndex = currentIndex === 0 ? posts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const buttonStyle = {
    padding:0,
    color:'white',
    backgroundColor: '#FE9834',
    width:'40px',
    height:"30px",
    border:"none",
    cursor:'pointer',
  }

  return (
    <Grid sx={{minHeight:"200px", maxHeight:"400px", overflowY:"scroll"}}>
        <div style={{paddingLeft:'5%'}}>
        <h2>{name}'s Posts</h2>
        </div>

        <Grid  className="image-carousel" display="flex" alignItems={'center'} justifyContent={"center"} >
        <button onClick={goToPrevSlide} style={buttonStyle}>{'<'}</button>
        <Grid sx={{width:"90%"}}>          
        <Grid sx={{backgroundColor:"white", marginBottom:-1}}>
          <p style={{fontStyle:"italic",marginBottom:-10, marginTop:10, paddingTop:10, paddingLeft: 15}}>{posts[currentIndex].date}: </p>
          <RichEditor
                    readOnly={true}
                    initialValue={posts[currentIndex].text}
                    onChange={() => {}} // yeah these should be default args
                    post_id={posts[currentIndex].post_id}
                  />
          
          </Grid>
          <CommentsContainer post={posts[currentIndex]}/>
        </Grid>  

        <button onClick={goToNextSlide} style={buttonStyle}>{'>'}</button>

      </Grid>
    </Grid>
    
  );
};

type CommentProps = {
  post: Posts
}
const CommentsContainer: React.FC<CommentProps> = ({post}) => {
  const [showComments, setShowComments] = useState(false);
  const handleViewComments = () => {
    setShowComments(!showComments);
  };  
  return (
    <div>
       <Grid2
        container
        display="flex"
        sx={{ backgroundColor: "white" }}
        //style={{ width: "100%" }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ width: "100%" }}>
            <div>
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
          </div>
        </div>
      </Grid2>
    {showComments && post.comments.map((comment) => {
        return (
          <div
            key={comment.comment_id}
            style={{
              display: "flex",
              flexDirection: "row",
              padding: "1rem",
              backgroundColor:'white'
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
                    {comment.date}
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
      })
    }
    </div> )
  }


export default RecentPostsContainer;