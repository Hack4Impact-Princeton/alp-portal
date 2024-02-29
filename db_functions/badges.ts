import {VolunteerAccount} from "../models/VolunteerAccount";


enum BadgeType {
    Organizer,
    Profile,
    Connector,
    Supporter,
    Leader,
    Participation
}


function getBadgeName() {

}

function getBadgeDescription() {

}
async function updateConnector(email: string, post_id: string) {
    const res = await fetch(`/api/volunteeraccounts/${email}`, {
        method: "GET",
      })
    const user = (await res.json()).data as VolunteerAccount;
    user.postIDs.push(post_id)
    let numPosts = user.postIDs.length
    if (numPosts >= 15)    
        user.badges.Connector = 4
    else if (numPosts >= 10)
        user.badges.Connector = 3
    else if (numPosts >= 5)
        user.badges.Connector = 2
    else if (numPosts >= 1)
        user.badges.Connector = 1
    const update = await fetch(`/api/volunteeraccounts/${email}`, {
        method: "PATCH",
        body: JSON.stringify(user),
    });
}
async function updateLeader(email: string) {
    const res = await fetch(`/api/volunteeraccounts/${email}`, {
        method: "GET",
      })
    const user = (await res.json()).data as VolunteerAccount;
    user.commentsReceived++
    if (user.commentsReceived >= 15)    
        user.badges.Leader = 4
    else if (user.commentsReceived >= 10)
        user.badges.Leader = 3
    else if (user.commentsReceived >= 5)
        user.badges.Leader = 2
    else if (user.commentsReceived >= 1)
        user.badges.Leader = 1
    const update = await fetch(`/api/volunteeraccounts/${email}`, {
        method: "PATCH",
        body: JSON.stringify(user),
    });
}

async function updateSupporterBadge(email : string) {
    const res = await fetch(`/api/volunteeraccounts/${email}`, {
        method: "GET",
      })
    const user = (await res.json()).data as VolunteerAccount;
    user.commentsPosted++;
    if (user.commentsPosted >= 15)    
        user.badges.Supporter = 4
    else if (user.commentsPosted >= 10)
        user.badges.Supporter = 3
    else if (user.commentsPosted >= 5)
        user.badges.Supporter = 2
    else if (user.commentsPosted >= 1)
        user.badges.Supporter = 1
    const update = await fetch(`/api/volunteeraccounts/${email}`, {
        method: "PATCH",
        body: JSON.stringify(user),
    });

}

export {updateSupporterBadge, updateConnector, updateLeader}