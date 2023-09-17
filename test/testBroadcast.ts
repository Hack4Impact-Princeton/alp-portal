// const genUniqueId = require("../lib/idGen");
const genUniqueIdBroadcast = (): string => {
    const dateStr = Date
      .now()
      .toString(36); // convert num to base 36 and stringify
  
    const randomStr = Math
      .random()
      .toString(36)
      .substring(2, 8); // start at index 2 to skip decimal point
  
    return `${dateStr}-${randomStr}`;
  }

const testPost = async(): Promise<void> => {
    const data = {
        id: genUniqueIdBroadcast(),
        senderEmail: 'email_test@gmail.com',
        receiverEmails: ['test1@test.com', 'test2@test.com'],
        read: [false, false],
        sentTime: new Date().toString(),
        subject: "testing broadcast",
        message: "test message body contents",
    }
    console.log(data)
    const res = await fetch(`http://localhost:3000/api/broadcast/${data.id}`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
    // console.log(res)
    const resJson = await res.json()
    console.log(resJson)
    const resData = resJson.data
    console.log(resData)
}
testPost()