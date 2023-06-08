export type VolunteerAccount = {
    fname: string,
    lname: string,
    alp_id: number,
    ageBucket: number,
    email: string,
    pwhash: string,
    location: number,
    dateJoined: Date,
    allDrives: number,
    driveIds: string[],
    badges: number,
}