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
  useBadges?: boolean; // Make useBadges optional
  style?: React.CSSProperties;
};

const ProfileCard: React.FC<ProfileCardProps> = ({ name, state, email, profilePicture, badges, useBadges = true }) => {
  const cardStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    padding: '10px',
    marginBottom: '10px',
    width: '300px',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    marginBottom: '10px',
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
          <div>
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
      {/* Add other profile card content as needed */}
    </div>
  );
};

export default ProfileCard;
