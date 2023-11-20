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
  friendStatus: string;
  onFriendRequest: () => void;
  onRevokeFriendRequest: () => void;
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f9f9f9'
  };

  const contentStyle: React.CSSProperties = {
    marginLeft: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1, // Let the content take the available space
  };

  const imageStyle: React.CSSProperties = {
    width: '100px', // Adjust the width as needed
    height: 'auto',
    marginBottom: '10px',
  };

const badgesContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column', // Arrange badges vertically
  alignItems: 'flex-start', // Align badges to start (left)
  marginBottom: '10px',
};

const buttonsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
};

  const getButtonColor = () => {
    switch (friendStatus) {
      case 'none':
        return '#FE9834';
      case 'sent':
      case 'received':
        return '#FF6347';
      case 'friends':
        return '#4CAF50';
      default:
        return '#FE9834';
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: getButtonColor(),
    color: 'white',
    cursor: 'pointer',
    margin: '4px 0',
  };

  const revokeButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '4px',
    backgroundColor: '#A9A9A9',
    color: 'white',
    cursor: 'pointer',
    margin: '4px 0',
  };

  const revokeIconStyle: React.CSSProperties = {
    marginLeft: '4px', // Adjust the left positioning
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
      <div style={contentStyle}>
        <p>{name}</p>
        <p>{state}</p>
        <p>{email}</p>
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
            </div>
          </>
        )}
        <div style={buttonsContainerStyle}>
          {friendStatus === 'none' && (
            <button onClick={handleSendFriendRequest} style={buttonStyle}>
              Send Friend Request
            </button>
          )}
          {friendStatus === 'sent' && (
            <div style={{ position: 'relative', width: '100%' }}>
              <div style={revokeButtonStyle}>
                Revoke
                <span
                  style={revokeIconStyle}
                  onClick={() => {
                    handleRevokeFriendRequest();
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
    </div>
  );
};

export default ProfileCard;