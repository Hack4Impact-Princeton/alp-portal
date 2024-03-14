import React, { useState } from "react";
import Grid from "@mui/material/Grid"; 
import { IconButton,Button, Modal } from "@mui/material";
import { Posts } from "../../models/Post";
import RichEditor from "../forum/RichEditor";
import PostContainer from "../forum/PostContainer";


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
                onChange={() => {}} // yeah these should be default args
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
                  boxShadow: 24,
                  p: 4,}}>
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
    cursor:'pointer'
  }

  return (
    <Grid sx={{}}>
        <h2>{name}'s Posts</h2>
        <Grid className="image-carousel" display="flex" alignItems="center" justifyContent={"center"} minHeight="200px">
        <button onClick={goToPrevSlide} style={buttonStyle}>{'<'}</button>
        <div style={{width:"90%"}}>
        <RichEditor
                  readOnly={true}
                  initialValue={posts[currentIndex].text}
                  onChange={() => {}} // yeah these should be default args
                  post_id={posts[currentIndex].post_id}
                />
        </div>  
        <button onClick={goToNextSlide} style={buttonStyle}>{'>'}</button>
      </Grid>
    </Grid>
    
  );
};

export default RecentPostsContainer;