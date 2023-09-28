import { VolunteerAccount } from "../models/VolunteerAccount";

const addFriendToList = async(email1: string, email2: string) => {
    try {
        const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
            method: "GET",
        })
        const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
            method: "GET",
        })
        if (!volunteer1res.ok) throw new Error(`Could not find an account with email ${email1}`)
        if (!volunteer2res.ok) throw new Error(`Could not find an account with email ${email2}`)
        const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount
        const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount
        if (volunteer1.friends.includes(volunteer2.alp_id)) throw new Error(`${email2} is already your friend`)
        const friendsArray1 = [...volunteer1.friends, volunteer2.alp_id]
        const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
            method: "PATCH",
            body: JSON.stringify({friends: friendsArray1})
        })

        if (!res1.ok) throw new Error("Something went wrong adding friend2 to friend1s array")
        return {success: true, data: "hi"}
    } catch (e: Error | any) {
        console.error(e)
        return {success: false, error: e}
    }
}

export const removeFriend = async(email1: string, email2: string) => {
    try {
        const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
            method: "GET",
        })
        const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
            method: "GET",
        })
        if (!volunteer1res.ok) throw new Error(`Could not find an account with email ${email1}`)
        if (!volunteer2res.ok) throw new Error(`Could not find an account with email ${email2}`)
        const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount
        const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount
        if (!volunteer1.friends.includes(volunteer2.alp_id)) throw new Error(`${email2} is not your friend`)
        if (!volunteer2.friends.includes(volunteer1.alp_id)) throw new Error(`${email1} is not your friend`)
        const friendsArray1 = volunteer1.friends.filter(friend => friend !== volunteer2.alp_id)
        const friendsArray2 = volunteer2.friends.filter(friend => friend !== volunteer1.alp_id)
        const res1 = await fetch(`/api/volunteeraccounts/${email1}`, {
            method: "PATCH",
            body: JSON.stringify({friends: friendsArray1})
        })
        const res2 = await fetch(`/api/volunteeraccounts/${email2}`, {
            method: "PATCH",
            body: JSON.stringify({friends: friendsArray2})
        })
        if (!res1.ok) throw new Error("Something went wrong removing friend2 from friend1s array")
        if (!res2.ok) {
            // undo adding removing friend2 from friend 1s list
            await fetch(`/api/volunteeraccounts${email1}`, {
                method: "PATCH",
                body: JSON.stringify(volunteer1.friends)
            })
            throw new Error("Something went wrong removing friend1 from friend2s array")
        }
        return {success: true, data: "hi"}
    } catch (e: Error | any) {
        console.error(e)
        return {success: false, error: e}
    }
}

export const checkFriendStatus = async(email1: string, email2: string) => {
    try {
        const volunteer1res = await fetch(`/api/volunteeraccounts/${email1}`, {
            method: "GET",
        })
        const volunteer2res = await fetch(`/api/volunteeraccounts/${email2}`, {
            method: "GET",
        })
        if (!volunteer1res.ok) throw new Error(`Could not find an account with email ${email1}`)
        if (!volunteer2res.ok) throw new Error(`Could not find an account with email ${email2}`)
        const volunteer1 = (await volunteer1res.json()).data as VolunteerAccount
        const volunteer2 = (await volunteer2res.json()).data as VolunteerAccount
        // if the user appears in the non-user's list
        const oneInTwo = volunteer2.friends.includes(volunteer1.alp_id)
        // if the non-user appears in the curr user's list
        const twoInOne = volunteer1.friends.includes(volunteer2.alp_id)
        let message = ""
        if (oneInTwo && twoInOne) message = "Remove"
        if (oneInTwo && !twoInOne) message = "Requested"
        if (twoInOne && !oneInTwo) message = "Accept Request"
        if (!oneInTwo && !twoInOne) message = "Add"
        return {success: true, message: message}
    } catch (e: Error | any) {
        console.error(e)
        return {success: false, error: e}
    }
}

addFriendToList("test2@test.com", "test3@test.com")

export default addFriendToList
