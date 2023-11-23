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
  useBadges?: boolean;
};

const ProfileDisplayCase: React.FC<{ profiles: ProfileInfoProps[]; useBadges?: boolean }> = ({ profiles, useBadges = true }) => {
  return (
    <Grid container style={{padding: '10px', marginBottom: '10px', display: 'flex', width: '200%' }}>
      <Grid xs={12}><h2 style={{ textAlign: 'left', marginBottom: '10px' }}></h2></Grid>
      <Grid container xs={12} style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', paddingLeft: '10px', gap: '20px' }}>
        {profiles.map((profile, index) => (
           <ProfileDisplayCase profiles={profiles} useBadges={true} />
        ))}
      </Grid>
    </Grid>
  );
};

export default ProfileDisplayCase;
