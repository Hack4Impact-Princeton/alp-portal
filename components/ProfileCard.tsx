import React from 'react';

type BadgeInfoProps = {
  isEarned: boolean;
  level: number;
  name: string;
  description: string;
};

type ProfileCardProps = {
    name: string;
  state: string;
  email: string;
  profilePicture: string;
  badges: BadgeInfoProps[];
  useBadges?: boolean;
  friendStatus: string; // Add friendStatus prop
  onFriendRequest: () => void; // Add onFriendRequest prop
  onRevokeFriendRequest: () => void; // Add onRevokeFriendRequest prop
  style?: React.CSSProperties;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ name, state, email, profilePicture, badges, useBadges = true }) => {
  const [friendStatus, setFriendStatus] = React.useState<string>('none');
  const [showRevokeButton, setShowRevokeButton] = React.useState<boolean>(false);

const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
  };

  const badgesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: '10px',
  };

const buttonsContainerStyle: React.CSSProperties = {
  marginTop: '10px', // Add margin to separate buttons from badges
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%', // Ensure the container takes the full width
};
const getButtonColor = () => {
  switch (friendStatus) {
    case 'none':
      return '#FE9834'; // Color for "Send Friend Request"
    case 'sent':
    case 'received':
      return '#FF6347'; // Color for "Revoke Friend Request"
    case 'friends':
      return '#4CAF50'; // Color for "Unfriend"
    default:
      return '#FE9834'; // Default color (you can change this)
  }
};
const buttonStyle: React.CSSProperties = {
  position: 'relative',
  padding: '8px 16px',
  borderRadius: '4px',
  border: 'none',
  backgroundColor: getButtonColor(),
  color: 'white',
  cursor: 'not-allowed',
  margin: '4px 0',
};

const revokeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  borderRadius: '4px',
  backgroundColor: '#A9A9A9', // Gray color for revoke button
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none', // Disable pointer events for the 'x' icon
};

const revokeIconStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '4px', // Adjust the left positioning
  transform: 'translateY(-50%)',
  cursor: 'pointer',
};

  const handleSendFriendRequest = () => {
    setFriendStatus('sent');
    setShowRevokeButton(true);
  };

  const handleRevokeFriendRequest = () => {
    setFriendStatus('none');
  };

  const handleAcceptFriendRequest = () => {
    setFriendStatus('friends');
    setShowRevokeButton(true);
  };

  return (
    <div style={cardStyle}>
      <img src={profilePicture} alt="Profile" style={imageStyle} />
      <p>Name: {name}</p>
      <p>State: {state}</p>
      <p>Email: {email}</p>
        {useBadges && (
        <>
          <h3>Badges:</h3>
          <div style={badgesContainerStyle}>
            {badges.map((badge, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px' }}>
                {badge.isEarned ? (
                  <img src="https://cdn-icons-png.flaticon.com/512/1435/1435715.png" alt="Unlocked Badge" style={{ width: '40px', height: '40px', marginBottom: '5px' }} />
                ) : (
                  <img src="https://cdn-icons-png.flaticon.com/512/1435/1435722.png" alt="Locked Badge" style={{ width: '40px', height: '40px', marginBottom: '5px', filter: 'grayscale(100%)' }} />
                )}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>{badge.name}</p>
                  <p style={{ margin: 0, fontSize: '12px' }}>{badge.description}</p>
                </div>
              </div>
            ))}

       {/* Friend Request Buttons */}
    <div style={buttonsContainerStyle}>
      {friendStatus === 'none' && (
        <button
          onClick={handleSendFriendRequest}
          style={{
            backgroundColor: '#FE9834',
            color: '#fff',
            padding: '5px 10px',
            cursor: 'pointer',
            border: 'none', // Remove the default button border
            outline: 'none', // Remove the default button outline
            // Add other styles as needed
          }}
        >
          Send Friend Request
        </button>
      )}
      {friendStatus === 'sent' && (
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={buttonStyle}>
            Revoke
            <span
              style={revokeIconStyle}
              onClick={() => {
                handleRevokeFriendRequest();
                // Explicitly set the friendStatus state to 'none' when 'x' is clicked
                setFriendStatus('none');
              }}
            >
              x
            </span>
          </div>
        </div>
      )}
      {(friendStatus === 'received' || friendStatus === 'friends') && showRevokeButton && (
        <button style={buttonStyle} onClick={handleRevokeFriendRequest}>
          Unfriend
        </button>
      )}
      {friendStatus === 'received' && (
        <button style={buttonStyle} onClick={handleAcceptFriendRequest}>
          Accept Friend Request
        </button>
      )}
    </div>
  </div>
        </>
      )}
      {/* Add other profile card content as needed */}
    </div>
  );
};

export default ProfileCard;
