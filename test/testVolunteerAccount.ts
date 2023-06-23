/* Instructions: 
    - if you haven't already installed, it run npm i -g ts-node
    - start the localhost:3000 server using npm run dev
    - open another node terminal
    - run 'ts-node test/testVolunteerAccount.ts' in the terminal
    - make sure every test passes
    - if a test doesn't pass, then look at the corresponding endpoint
    and see why (sometimes you have to modify the test)
*/

const baseUrl = `http://localhost:3000`

const postData = {
    fname: "testFname",
    lname: "testLname",
    email: "testEmail@test.com",
    pwhash: "testPassword",
    location: 1
}

const successfulPost = async (): Promise<void> => {
    console.log("Test 1: Successful creation of new volunteer")
    const postRes = await fetch(baseUrl + `/api/volunteeraccounts/${encodeURIComponent(postData.email)}`, {
        method: "POST",
        body: JSON.stringify(postData)
    })
    if (postRes.status !== 200) {
        console.log(`Test 1 failed - status code == ${postRes.status}`)
        const json = await postRes.json()
        console.log(json.data)
    }
    else {
        const postResJson = await postRes.json()
        if (!postResJson.success) console.log(`Test 1 failed - postResJson successful = false`)
        else if (!postResJson.data) console.log(`Test 1 failed: postResJson.data is null or undefined`)
        else {
            console.log(`Test 1 passed`)
            //console.log(postResJson.data)
        }
    }
    console.log("------------------------------")

}
const duplicatePost = async (): Promise<void> => {
    console.log("Test 2: Unsuccessful creation of new volunteer (duplicate)")
    const postRes = await fetch(baseUrl + `/api/volunteeraccounts/${encodeURIComponent(postData.email)}`, {
        method: "POST",
        body: JSON.stringify(postData)
    })
    if (postRes.status == 200) console.log("Test 2 failed - status code = 200")
    else {
        const postResJson = await postRes.json()
        if (postResJson.success != false) console.log("test 2 failed - successful is true and should be false")
        else if (postResJson.data != null) {
            console.log(`Test 2 failed - data should be null but is not: `)
            console.log(postResJson.data)
        }
        else console.log('Test 2 passed')
    }
    console.log("------------------------------")
}
const missingDataPost = async (): Promise<void> => {
    console.log("Test 3: Unsuccessful creation of new volunteer (missing body data)")
    const body = {
        gibberish: "true",
        fname: 1,
        email: "bla@bla.com"
    }
    const postRes = await fetch(baseUrl + `/api/volunteeraccounts/${encodeURIComponent(body.email)}`, {
        method: "POST",
        body: JSON.stringify(body)
    })
    if (postRes.status == 200) console.log("Test 3 failed - status should not be 200")
    else {
        const postResJSon = await postRes.json()
        if (postResJSon.data == null) console.log("Test 3 failed - data should contain the error message, not null")
        else {
            console.log(`Test 3 passed`)
            //console.log(" here is the error:")
            //console.log(postResJSon.data)
        }
    }
    console.log("------------------------------")
}
const invalidDataPost = async (): Promise<void> => {
    console.log("Test 4: Unsuccessful creation of new volunteer (invalid body data (wrong types))")
    const body = {
        fname: 1,
        lname: 1,
        email: 1,
        pwhash: 1,
        location: "hiiiii"
    }
    const postRes = await fetch(baseUrl + `/api/volunteeraccounts/${encodeURIComponent(body.email)}`, {
        method: "POST",
        body: JSON.stringify(body)
    })
    if (postRes.status == 200) console.log("Test 4 failed - status should not be 200")
    else {
        const postResJSon = await postRes.json()
        if (postResJSon.data == null) console.log("Test 4 failed - data should contain the error message, not null")
        else {
            console.log(`Test 4 passed`)
            // console.log("here is the error:")
            // console.log(postResJSon.data)
        }
    }
    console.log("------------------------------")
}

const unsuccessfulGet = async (): Promise<void> => {
    console.log("Test 5: unsuccessful GET (email doesn't match)")
    const badEmail = "hi@hi.com"
    const getRes = await fetch(baseUrl + `/api/volunteeraccounts/${encodeURIComponent(badEmail)}`)
    if (getRes.status == 200) console.log("Test 5 failed: status should not be 200 but is")
    else console.log("Test 5 passed")
    console.log("------------------------------")
}
const successfulGet = async (): Promise<void> => {
    console.log("Test 6: successful get")
    const getRes = await fetch(baseUrl + `/api/volunteeraccounts/${encodeURIComponent(postData.email)}`)
    const getResJson = await getRes.json()
    if (getRes.status != 200) {
        console.log("Test 6 failed: status should not be 400 but is")
        console.log(getResJson.data)
    } else {
        if (getResJson.data.fname != postData.fname) console.log("Test 6 failed: fnames don't match")
        else if (getResJson.data.lname != postData.lname) console.log("Test 6 failed: lnames don't match")
        else if (getResJson.data.email != postData.email) console.log("Test 6 failed: emails don't match")
        else if (getResJson.data.pwhash != postData.pwhash) console.log("Test 6 failed: passwords don't match")
        else if (getResJson.data.location != postData.location) console.log("Test 6 failed: locations don't match")
        else console.log("Test 6 passed")
    }
    console.log("------------------------------")

}
const update = {
    fname: "updatedFname",
    lname: "updatedLname",
    email: "updatedEmail",
    pwhash: "updatedPassword",
    location: 2,
}

const unsuccessfulPatch = async (): Promise<void> => {
    console.log("Test 7: unsuccessful patch (email doesn't exist)")
    const badEmail = "Hi@hi.com"
    const patchRes = await fetch(baseUrl + `/api/volunteeraccounts/${badEmail}`, {
        method: "PATCH",
        body: JSON.stringify(update)
    })
    if (patchRes.status == 200) console.log("Test 7 failed: status should not be 200 but is")
    else {
        const json = await patchRes.json()
        if (json.data) {
            console.log("Test 7 failed - json.data should be null but isn't")
            console.log(json.data)
        } else console.log("Test 7 passed")
    }
    console.log("------------------------------")

}
const successfulPatch = async (): Promise<void> => {
    console.log("Test 8: successful patch ")
    const patchRes = await fetch(baseUrl + `/api/volunteeraccounts/${postData.email}`, {
        method: "PATCH",
        body: JSON.stringify(update)
    })
    if (patchRes.status != 200) console.log("Test 8 failed: status should not be 400 but is")
    else {
        const json = await patchRes.json()
        if (!json.data) console.log("Test 8 failed - json.data shouldn't be null but is")
        else {
            if (json.data.fname != update.fname) console.log(`Test 8 failed: fnames don't match but should: data.fname: ${json.data.fname}`)
            else if (json.data.lname != update.lname) console.log(`Test 8 failed: lnames don't match but should: data.lname: ${json.data.lname}`)
            else if (json.data.email != update.email) console.log(`Test 8 failed: emails don't match but should: data.email: ${json.data.email}`)
            else if (json.data.pwhash != update.pwhash) console.log(`Test 8 failed: don't passwords match but should: data.password: ${json.data.pwhash}`)
            else if (json.data.location != update.location) console.log(`Test 8 failed: locations don't match but should: data.location: ${json.data.location}`)
            else console.log("Test 8 passed")
        }
    }
    console.log("------------------------------")
}

const unsuccessfulDelete = async (): Promise<void> => {
    console.log("Test 9: unsuccessful deletion (email doesn't exist)")
    const badEmail = "hi@hi.com"
    const delRes = await fetch(baseUrl + `/api/volunteeraccounts/${badEmail}`, {
        method: "DELETE",
    })
    if (delRes.status == 200) console.log("Test 9 failed: status should not = 200")
    else console.log("Test 9 passed")
    console.log("------------------------------")
}
const successfulDelete = async (): Promise<void> => {
    console.log("Test 10: Successful deletion")
    const delRes = await fetch(baseUrl + `/api/volunteeraccounts/${update.email}`, {
        method: "DELETE",
    })
    if (delRes.status != 200) console.log("Test 8 failed: status should be 200 but is 400")
    else console.log("Test 10 passed")
    console.log("------------------------------")
}



const tests = async (): Promise<void> => {
    await successfulPost()
    await duplicatePost()
    await missingDataPost()
    await invalidDataPost()
    await unsuccessfulGet()
    await successfulGet()
    await unsuccessfulPatch()
    await successfulPatch()
    await unsuccessfulDelete()
    await successfulDelete()
}
tests()


