export type BookDrive = {
    driveName: string,
    driveCode: string,
    organizer: string,
    startDate: string,
    completedDate: string,
    status: number,
    booksgoal: number,
    gs: { fundraise: string, terms: boolean }[],
    cb: { booksCurrent: number, updateFreq: number, lastUpdate: string }[],
    pts:
    {
        intFee: boolean, domFee: boolean,
        materials:
        { boxes: boolean, extraCardboard: boolean, tape: boolean, mailingLabels: boolean }[]
    }[],
}