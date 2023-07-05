import fetch from "node-fetch"

const BASE = "http://localhost:3000"

const tryTest1 = async () => {
    const test1_data = {
        "driveIds": ["Hello-World-Code", "SA3-32", "M15-33"]
    }
    const patchRes = await fetch(BASE + `/api/volunteeraccounts/test1@test.com`, {
        method: "PATCH",
        body: JSON.stringify(test1_data)
    })
    console.log(patchRes.status);
}

const tryTest2 = async () => {
    const test2_data = {
        "driveIds": ["Hello World.2 Code", "M15-00", "M15-32"]
    }
    const patchRes = await fetch(BASE + `/api/volunteeraccounts/test2@test.com`, {
        method: "PATCH",
        body: JSON.stringify(test2_data)
    })
    console.log(patchRes.status);
}


const addIvyData = async () => {
    const ivy_data = {
        "driveIds": ["M15-34", "M15-35", "M15-36", "SA3-41"]
    }

    const patchRes = await fetch(BASE + `/api/volunteeraccounts/ivwang46@gmail.com`, {
        method: "PATCH",
        body: JSON.stringify(ivy_data)
    })
    console.log(patchRes.status);
}

const addDerekData = async () => {
    const derek_data = {
        "driveIds": ["M15-37", "UG3-00", "SA3-00"]
    }
    const patchRes = await fetch(BASE + `/api/volunteeraccounts/dxiageng@gmail.com`, {
        method: "PATCH",
        body: JSON.stringify(derek_data)
    })
    console.log(patchRes.status);
}

const addEmilioData = async () => {
    const emilio_data = {
        "driveIds": ["M15-00"]
    }
    const patchRes = await fetch(BASE + `/api/volunteeraccounts/emiliochan979@gmail.com`, {
        method: "PATCH",
        body: JSON.stringify(emilio_data)
    })
    console.log(patchRes.status);
}


tryTest1();
tryTest2();
addIvyData();
addDerekData();
addEmilioData();