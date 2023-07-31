
const standardize = async(): Promise<void> => {
    try {
        const res = await fetch(`http://localhost:3000/api/bookDrive/standardize`, {
        method: "PATCH"
    })
    if (!res.ok) console.log("something went wrong", res)
    else {
        const resJson = await res.json()
        console.log(resJson.data)
    }
    } catch (e: Error | any) {
        console.error(e)
    }
}
standardize()