// ProfileDisplayCase.tsx
import React from 'react';
import { Grid } from '@mui/material';
import ProfileCard from './ProfileCard';

type BadgeInfoProps = {
  isEarned: boolean;
  level: number;
  name: string;
  description: string;
};

type ProfileInfoProps = {
  name: string;
  state: string;
  email: string;
  profilePicture: string;
  badges: BadgeInfoProps[];
};

const ProfileDisplayCase: React.FC<{ profiles: ProfileInfoProps[]; useBadges?: boolean }> = ({ profiles, useBadges = true }) => {
  return (
    <Grid container style={{ border: '1.5px solid black', padding: '10px', marginBottom: '10px', display: 'flex', width: '200%', backgroundColor: "#F5F5F5" }}>
      <Grid xs={12}><h2 style={{ textAlign: 'left', marginBottom: '10px' }}>Profiles: </h2></Grid>
      <Grid container xs={12} style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', paddingLeft: '10px', gap: '20px' }}>
        {profiles.map((profile, index) => (
          <ProfileCard key={index} useBadges={useBadges} {...profile} />
        ))}
      </Grid>
    </Grid>
  );
};

export default ProfileDisplayCase;
