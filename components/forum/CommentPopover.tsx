import Grid2 from "@mui/material/Unstable_Grid2";
import { useRef, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "@mui/material/Popover";


type props={
    key:string;
}

const CommentPopover: React.FC<props> = ({
    key
  }) => {
    const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null); // flagging comments popover 
    const popover2 = useRef(null);
    const open2 = Boolean(anchorEl2);
    const id2 = open2 ? 'popover2' : undefined;

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
            <button
                key={key}
                onClick={()=>console.log('pressed')}
                className={"popover-button"}>
                Flag Comment
            </button>

        </div>
        </Popover>

    </Grid2>
    </>
    
    )
  }
  export default CommentPopover