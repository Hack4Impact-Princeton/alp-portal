import mongoose from "mongoose";
import getVolunteerAccountModel, { VolunteerAccount } from "../models/VolunteerAccount";

// TO DO: add a revokeFriendRequest function (diff from remove)

/*export const sendFriendRequest = async (email1: string, email2: string) => {
  try {
    // const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
    //   method: "GET",
    // });
    // const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
    //   method: "GET",
    // });
    // if (!volunteer1res.ok)
    //   throw new Error(`Could not find an account with email ${email1}`);
    // if (!volunteer2res.ok)
    //   throw new Error(`Could not find an account with email ${email2}`);
    // const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount;
    // const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount;
    const VolunteerAccount: mongoose.Model<VolunteerAccount> =
      getVolunteerAccountModel();
    const senderAccount = await VolunteerAccount.findOne({
      email: email1,
    });
    if (!senderAccount) {
      throw new Error(`Sender account with email ${email1} not found`);
    }

    // Find the receiver account
    const receiverAccount = await VolunteerAccount.findOne({
      email: email2,
    });
    if (!receiverAccount) {
      throw new Error(`Receiver account with email ${email2} not found`);
    }
    const updatedSentFriendReqs = [
      ...senderAccount.sentFriendRequests,
      receiverAccount.email,
    ];
    console.log(updatedSentFriendReqs);

    const updatedReceivedFriendReqs = [
      ...receiverAccount.friendRequests,
      senderAccount.email,
    ];
    console.log(updatedReceivedFriendReqs);

    // const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
    //   method: "PATCH",
    //   body: JSON.stringify({ friendRequests: requestArray1 }),
    // });
    return { success: true, data: "hi" };
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};*/
export const sendFriendRequest = async (email1: string, email2: string) => {
  try {
    const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "GET",
    });
    const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "GET",
    });
    if (!volunteer1res.ok)
      throw new Error(`Could not find an account with email ${email1}`);
    if (!volunteer2res.ok)
      throw new Error(`Could not find an account with email ${email2}`);
    const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount;
    const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount;
    const requestArray1 = [...volunteer1.sentFriendRequests, volunteer2.email];
    console.log(requestArray1);

    // email 1 is sending request to email 2
    // volunteer1 sentFriendRequests array will append email 2
    // volunteeer2 friendRequests array will append email 1
    const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "PATCH",
      body: JSON.stringify({ sentFriendRequests: requestArray1 }),
    });
    const res2 = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "PATCH",
      body: JSON.stringify({ friendRequests: [...volunteer2.friendRequests, volunteer1.email]})
    })
    return { success: true, data: "hi" };
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};


// volunteer1 got friend request from volunteer2 and is approving it
// so volunteer1 has to remove volunteer2 from its friendRequest array
// and volunteer2 has to remove volunteer1 from its sentFriendRequest array
export const approveFriendRequest = async (email1: string, email2: string) => {
  try {
    const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "GET",
    });
    const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "GET",
    });
    if (!volunteer1res.ok)
      throw new Error(`Could not find an account with email ${email1}`);
    if (!volunteer2res.ok)
      throw new Error(`Could not find an account with email ${email2}`);
    const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount;
    const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount;
    if (volunteer1.friends.includes(volunteer2.email))
      throw new Error(`${email2} is already your friend`);
    const friendsArray1 = [...volunteer1.friends, volunteer2.email];
    const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "PATCH",
      body: JSON.stringify({ friends: friendsArray1 }),
    });
    const friendsArray2 = [...volunteer2.friends, volunteer1.email];
    const res2 = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "PATCH",
      body: JSON.stringify({ friends: friendsArray2 }),
    });
    const done = await removeFriendRequest(email1, email2);

    if (!res1.ok)
      throw new Error("Something went wrong adding friend2 to friend1s array");
    return { success: true, data: "hi" };
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};


// so volunteer1 has to remove volunteer2 from its friendRequest array
// and volunteer2 has to remove volunteer1 from its sentFriendRequest array
export const removeFriendRequest = async (email1: string, email2: string) => {
  try {
    console.log("Removing requests now")
    const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "GET",
    });
    const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "GET",
    });
    if (!volunteer1res.ok)
      throw new Error(`Could not find an account with email ${email1}`);
    if (!volunteer2res.ok)
      throw new Error(`Could not find an account with email ${email2}`);
    const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount;
    const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount;
    /*if (!volunteer1.friends.includes(volunteer2.email))
      throw new Error(`${email2} is not your friend`);
    if (!volunteer2.friends.includes(volunteer1.email))
      throw new Error(`${email1} is not your friend`);*/
    const friendsArray1 = volunteer1.friendRequests.filter(
      (friend) => friend !== volunteer2.email
    );
    const friendsArray2 = volunteer2.sentFriendRequests.filter(
      (friend) => friend !== volunteer1.email
    );
    
    console.log("first cleaning up " + email1 + " friendRequests")
    const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "PATCH",
      body: JSON.stringify({ friendRequests: friendsArray1 }),
    });
    console.log("first cleaning up " + email2 + " sentFriendRequests");
    const res2 = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "PATCH",
      body: JSON.stringify({ sentFriendRequests: friendsArray2 }),
    });
    if (!res1.ok)
      throw new Error(
        "Something went wrong removing friend2 from friend1s array"
      );
    if (!res2.ok) {
      throw new Error(
        "Something went wrong removing friend1 from friend2s array"
      );
    }
    return { success: true, data: "hi" };
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};

export const removeFriend = async (email1: string, email2: string) => {
  try {
    const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "GET",
    });
    const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "GET",
    });
    if (!volunteer1res.ok)
      throw new Error(`Could not find an account with email ${email1}`);
    if (!volunteer2res.ok)
      throw new Error(`Could not find an account with email ${email2}`);
    const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount;
    const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount;
    if (!volunteer1.friends.includes(volunteer2.email))
      throw new Error(`${email2} is not your friend`);
    if (!volunteer2.friends.includes(volunteer1.email))
      throw new Error(`${email1} is not your friend`);
    const friendsArray1 = volunteer1.friends.filter(
      (friend) => friend !== volunteer2.email
    );
    const friendsArray2 = volunteer2.friends.filter(
      (friend) => friend !== volunteer1.email
    );
    const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "PATCH",
      body: JSON.stringify({ friends: friendsArray1 }),
    });
    const res2 = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "PATCH",
      body: JSON.stringify({ friends: friendsArray2 }),
    });
    if (!res1.ok)
      throw new Error(
        "Something went wrong removing friend2 from friend1s array"
      );
    if (!res2.ok) {
      // undo adding removing friend2 from friend 1s list
      await fetch(`/api/volunteeraccounts${email1}`, {
        method: "PATCH",
        body: JSON.stringify(volunteer1.friends),
      });
      throw new Error(
        "Something went wrong removing friend1 from friend2s array"
      );
    }
    return { success: true, data: "hi" };
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};

export const checkFriendStatus = async (email1: string, email2: string) => {
  try {
    const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
      method: "GET",
    });
    const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
      method: "GET",
    });
    if (!volunteer1res.ok)
      throw new Error(`Could not find an account with email ${email1}`);
    if (!volunteer2res.ok)
      throw new Error(`Could not find an account with email ${email2}`);
    const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount;
    const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount;
    // if the user appears in the non-user's list
    const oneInTwo = volunteer2.friends.includes(volunteer1.email);
    // if the non-user appears in the curr user's list
    const twoInOne = volunteer1.friends.includes(volunteer2.email);
    let message = "";
    if (oneInTwo && twoInOne) message = "Remove";
    if (oneInTwo && !twoInOne) message = "Requested";
    if (twoInOne && !oneInTwo) message = "Accept Request";
    if (!oneInTwo && !twoInOne) message = "Add";
    return { success: true, message: message };
  } catch (e: Error | any) {
    console.error(e);
    return { success: false, error: e };
  }
};

//approveFriendRequest("test2@test.com", "test3@test.com");

//export { approveFriendRequest, approveFriendRequest, removeFriendRequest };
