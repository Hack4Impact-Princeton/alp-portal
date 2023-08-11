import { BookDrive } from "../models/BookDrive"
const createBookDrive = async (driveName: string, driveCode: string, organizer: string, startDate: string, booksGoal: number, country: string) => {
    try {
        const drive: BookDrive = {
            driveName: driveName,
            driveCode: driveCode,
            organizer: organizer,
            country: country,
            startDate: startDate,
            booksGoal: booksGoal,
            fl: { isFinalized: false, shipments: [] },
            status: 0,
            gs: { fundraise: "", terms: false },
            cb: { booksCurrent: 0, updateFreq: 0, lastUpdate: new Date() },
            pts: {
                intFee: 0,
                domFee: 0,
                materials: {
                    boxes: false,
                    extraCardboard: false,
                    tape: false,
                    mailingLabels: false
                }
            },
        }
        console.log(drive)
        const res = await fetch(`/api/bookDrive/${driveCode}`, {
            method: "POST",
            body: (JSON.stringify(drive))
        })
        if (!res.ok) return { succesful: false, data: null }
        const resJson = await res.json()
        return { successful: true, data: resJson }
    }
    catch (e: Error | any) {
        console.error(e.message)
        return { successful: false, data: null }
    }
}

export default createBookDrive