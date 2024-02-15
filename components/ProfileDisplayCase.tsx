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
  account: VolunteerAccount;
  name: string;
  state: string;
  email: string;
  profilePicture: string;
  badges: BadgeInfoProps[];
  affiliation: string;
  useBadges?: boolean;
};

const ProfileDisplayCase: React.FC<{account: VolunteerAccount; userEmail: string; profiles: ProfileInfoProps[]; useBadges?: boolean; receivedFriendRequestList: string[]}> = ({ account, userEmail, profiles, useBadges = true, receivedFriendRequestList}) => {

  return (
    <Grid
      container
      style={{
        padding: "10px",
        marginBottom: "10px",
        display: "flex",
        width: "200%",
      }}
    >
      <Grid xs={12}>
        <h2 style={{ textAlign: "left", marginBottom: "10px" }}></h2>
      </Grid>
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "flex-start",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {profiles.map((profile, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={index}
            style={{ marginLeft: "10px", marginRight: "50px" }}
          >
            <ProfileCard
              account={account}
              name={profile.name}
              state={profile.state}
              email={profile.email}
              affiliation={profile.affiliation}
              profilePicture={profile.profilePicture}
              //badges={profile.badges}
              useBadges={useBadges}
              userEmail={userEmail}
              receivedFriendRequestList={receivedFriendRequestList}
            />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default ProfileDisplayCase;
