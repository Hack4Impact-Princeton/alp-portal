import TeamMember from '../components/TeamMember'
import Grid from '@mui/material/Unstable_Grid2';

function TeamPage () {
    return(
        <div className='teampage'>
            <h1>The Hack4Impact Team</h1>
            <h2>Spring 2023</h2>
            <h2>Fall 2022</h2>
            <Grid container spacing={3}>
                <Grid xs={3}>
                    <TeamMember
                        name="Ivy Wang"
                        role="Tech Lead"
                        imgsrc="https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"
                    ></TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Suhani Balachandran"
                        imgsrc="https://whitmancollege.princeton.edu/sites/g/files/toruqf1576/files/styles/3x4_750w_1000h/public/people/picture_-_suhani_balachandran.jpg?itok=ZcVhhuTv">
                    </TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Ivy Wang"
                        imgsrc="https://kellercenter.princeton.edu/sites/default/files/styles/square/public/images/2020%20Incubator%20-%2010X%20Project%20-%20Ivy%20Wang.JPG?h=3ba71f74&itok=0YopKwug"
                    ></TeamMember>
                </Grid>
                <Grid xs={3}>
                    <TeamMember
                        name="Suhani Balachandran"
                        imgsrc="https://whitmancollege.princeton.edu/sites/g/files/toruqf1576/files/styles/3x4_750w_1000h/public/people/picture_-_suhani_balachandran.jpg?itok=ZcVhhuTv">
                    </TeamMember>
                </Grid>
            </Grid>
        </div>
    )
}

export default TeamPage