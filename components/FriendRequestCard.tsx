import React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import approveFriendRequest, {
  removeFriendRequest,
} from "../db_functions/friending";

type FriendRequestCardProps = {
  profilePicture: string; // URL of the profile picture
  name: string;
  reqEmail: string;
  //date: string; // Date of the friend request
  state: string; // State of the friend request (e.g., pending, approved, rejected)
  myEmail: string;
  requeststate? : string;
  //index: number; // Index of the friend request
  onApprove: (reqEmail: string) => void; // Callback function when the approve button is clicked
  onReject: (reqEmail: string) => void; // Callback function when the reject button is clicked
  onActionCompleted: (message: string) => void; // Callback function when an action (approve/reject) is completed
};

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  profilePicture,
  name,
  reqEmail,
  state,
  myEmail,
  requeststate,
  onApprove,
  onReject,
  onActionCompleted
}) => {
  // Format the date
  //const formattedDate = new Date(date).toLocaleDateString(); 
  return (
    <Card>
      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
        <Badge
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          badgeContent={requeststate === 'pending' ? 'New' : ' '}
          color={requeststate === 'pending' ? 'primary' : 'default'}
        >
          <Avatar variant= "square" alt={name} src={profilePicture} sx={{ width: 80, height: 80 }} />
        </Badge>
        <div style={{ marginLeft: '10px', flex: 1 }}> {/* Add margin to separate profile picture and information */}
          <Typography variant="h6">{name}</Typography>
          <Typography variant="subtitle1">affiliation here</Typography>
          <Typography variant="caption" color="textSecondary">
            {"Date here"} | {state}
          </Typography>
        </div>
      </CardContent>
      <CardActions style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'  }}>
        {requeststate === 'pending' && (
          <>
            <Button size="small"
              fullWidth
              style={{
                borderRadius: 0,
                backgroundColor: '#F3D39A',
                color: '#5F5F5F',
                margin: '0px 4px', // Updated margin
                fontWeight: 'bold', // Bold when active
              }}
              onClick={() => {
                onApprove(reqEmail);
                approveFriendRequest(myEmail, reqEmail);
                onActionCompleted('Friend request approved.');
              }}>
              Approve
            </Button>
            <Button size="small"              
              fullWidth
              style={{
                borderRadius: 0,
                backgroundColor: '#F3D39A',
                color: '#5F5F5F',
                margin: '0 2px', // Updated margin
                fontWeight: 'bold', // Bold when active
              }}onClick={() => {
                onReject(reqEmail);
                removeFriendRequest(myEmail, reqEmail);
                onActionCompleted('Friend request rejected.');
              }}>
              Reject
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default FriendRequestCard;
