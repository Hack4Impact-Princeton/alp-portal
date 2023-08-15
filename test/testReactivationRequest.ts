const genUniqueId = (): string => {
    const dateStr = Date
      .now()
      .toString(36); // convert num to base 36 and stringify
  
    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8); // start at index 2 to skip decimal point
  
    return `${dateStr}-${randomStr}`;
  }

const testReactivationRequestPost = async(): Promise<void> => {
    const data = {
        id: genUniqueId(),
        driveCode: 'SA3-32',
        date: new Date(),
        volunteerId: 8,
        message: "bro pls accept my reactivation request",
    }
    console.log(data)
    const res = await fetch(`http://localhost:3000/api/reactivationRequest/${data.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    // console.log(res)
    const resJson = await res.json()
    console.log(resJson)
    const resData = resJson.data
    console.log(resData)
}

const deleteReq = async(driveCode: string, reactivationReqId: string) => {
    try {
        const driveRes = await fetch(`http://localhost:3000/api/bookDrive/${driveCode}`, {
            method: "PUT",
            body: JSON.stringify({reactivationRequestId: null})
        })
        if (!driveRes) throw new Error("something went wrong while deleting the reactivation request from the bookdrive")
        const reactivationReq = await fetch(`http://localhost:3000/api/reactivationRequest/${reactivationReqId}`, {
            method: "DELETE",
        })
        if (!reactivationReq) {
            throw new Error("something went wrong deleting the reactivationreq entry")
        }
        console.log("success")
    } catch (e: Error | any) {
        console.error(`Error : ${e}`)
        return {success: false, error: e}
    }
}

const editReq = async (reactivationReqId: string, message: string) => {
    try {
        if (message === '') return {success: false, error: new Error("Message cannot be empty")}
        const update = {
            message: message,
            date: new Date(),
        }
        const res = await fetch(`http://localhost:3000/api/reactivationRequest/${reactivationReqId}`, {
            method: "PATCH",
            body: JSON.stringify(update)
        })
        const resJson = await res.json()
        if (!res.ok) throw new Error(resJson.data)
        if (!resJson.data) throw new Error("Something went wrong")
        return { success: true, reactivationReq: resJson.data}
    } catch (e: Error | any) {
        console.error(e)
        return { success: false, error: e }
    }
}
// testReactivationRequestPost()
// deleteReq("SA3-32", "llcv2cdn-cyfug9")
editReq('llcv5l4v-hj3tsw', "this is the edited string")
