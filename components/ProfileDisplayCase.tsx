// ProfileDisplayCase.tsx
import React from 'react';
import { Grid } from '@mui/material';
import ProfileCard from './ProfileCard';
import {BadgeType} from '../models/VolunteerAccount'

type BadgeInfoProps = {
  isEarned: boolean;
  level: number;
  name: string;
  description: string;
};

type ProfileInfoProps = {
  name: string;
  // state: string;
  email: string;
  profilePicture: string;
  badges: BadgeInfoProps[];
  affiliation: string;
  useBadges?: boolean;
};

const ProfileDisplayCase: React.FC<{ profiles: ProfileInfoProps[]; useBadges?: boolean }> = ({ profiles, useBadges = true }) => {
  return (
    <Grid container style={{ padding: '10px', marginBottom: '10px', display: 'flex', width: '200%' }}>
      <Grid xs={12}>
        <h2 style={{ textAlign: 'left', marginBottom: '10px' }}></h2>
      </Grid>
      <Grid container style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        {profiles.map((profile, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index} style={{marginLeft:'10px', marginRight:'50px'}}>
            <ProfileCard
              name={profile.name}
              // state={profile.state}
              state={"JERSEYYYY"}
              email={profile.email}
              affiliation = {profile.affiliation}
              profilePicture={profile.profilePicture}
              //badges={profile.badges}
              useBadges={useBadges}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProfileDisplayCase;
