import React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

type FriendRequestCardProps = {
  profilePicture: string; // URL of the profile picture
  name: string;
  email: string;
  date: string; // Date of the friend request
  state: string; // State of the friend request (e.g., pending, approved, rejected)
  requeststate : string;
  onApprove: () => void; // Callback function when the approve button is clicked
  onReject: () => void; // Callback function when the reject button is clicked
};

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  profilePicture,
  name,
  email,
  date,
  state,
  requeststate,
  onApprove,
  onReject,
}) => {
  // Format the date
  const formattedDate = new Date(date).toLocaleDateString(); 
  return (
    <Card>
      <CardContent style={{ display: 'flex', alignItems: 'center' }}>
        <Badge
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          badgeContent={requeststate === 'pending' ? 'New' : state.charAt(0).toUpperCase() + state.slice(1)}
          color={requeststate === 'pending' ? 'primary' : 'default'}
        >
          <Avatar alt={name} src={profilePicture} />
        </Badge>
        <div style={{ marginLeft: '10px' }}> {/* Add margin to separate profile picture and information */}
          <Typography variant="h6">{name}</Typography>
          <Typography variant="subtitle1">{email}</Typography>
          <Typography variant="caption" color="textSecondary">
            {formattedDate} | {state}
          </Typography>
        </div>
      </CardContent>
      <CardActions>
        {requeststate === 'pending' && (
          <>
            <Button size="small"
              style={{ backgroundColor: '#F3D39A', color: 'black' }}
             color="primary" onClick={onApprove}>
              Approve
            </Button>
            <Button size="small"              
            style={{ backgroundColor: '#F3D39A', color: 'black' }}
            color="secondary" onClick={onReject}>
              Reject
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default FriendRequestCard;
