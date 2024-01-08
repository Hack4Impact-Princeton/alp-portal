import crypto from "crypto"
const unsignedUploadPreset = 'nlgprs4r'


const generateSHA1 = (data: any) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
  };
  

const getPublicIdFromUrl = (url : string) => {
    const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/
    const match = url.match(regex);
    return match ? match[1] : null;
};

const imageUpload = async (file: File) => {
    try {
        let url = '';
        let data = new FormData()
        const apiKey = "272711192725652";
        const apiSecret = "6X7Fj1EPJa2YqOgGqiE7mvL5Ras";  
        const timestamp = new Date().getTime().toString();
        const signature = generateSHA1(`timestamp=${timestamp}${apiSecret}`).toString();
        data.append("file", file)
        data.append("api_key", apiKey)
        data.append("timestamp", timestamp)
        data.append("signature", signature)
        await fetch("https://api.cloudinary.com/v1_1/alp-portal/image/upload/", {
            method: "POST",
            body: data
        })
            .then((response) => response.json())
            .then((data) => {
              // File uploaded successfully
              url = data.secure_url
            
            }
            )
        return url
    } 
    catch(e) {
        console.log("ERROR")
        console.log(e)
        return ``
    }

}
const imagePfpUpload = async (file: File) => {
    try {
        let url = '';
        let data = new FormData()
        const apiKey = "272711192725652";
        const apiSecret = "6X7Fj1EPJa2YqOgGqiE7mvL5Ras";  
        const timestamp = new Date().getTime().toString();
        const signature = generateSHA1(`eager=c_thumb,g_face,h_150,w_150&timestamp=${timestamp}${apiSecret}`).toString();
        data.append("file", file)
        data.append("api_key", apiKey)
        data.append("timestamp", timestamp)
        data.append("eager", "c_thumb,g_face,h_150,w_150")
        data.append("signature", signature)
        await fetch("https://api.cloudinary.com/v1_1/alp-portal/image/upload/", {
            method: "POST",
            body: data
        })
        .then((response) => response.json())
            .then((data) => {
              // File uploaded successfully
              url = "https://res.cloudinary.com/alp-portal/image/upload/c_thumb,g_face,h_150,w_150/" + getPublicIdFromUrl(data.secure_url)
            }
        )
        return url
    }catch(e) {
        console.log("ERROR")
        console.log(e)
        return ``
    }
}

const imageDelete = async (URL : string) => {
    try {
        const cloudName = "alp-portal";
        const apiKey = "272711192725652";
        const apiSecret = "6X7Fj1EPJa2YqOgGqiE7mvL5Ras";  
        const timestamp = new Date().getTime().toString();
        const publicID = getPublicIdFromUrl(URL)
        if (!publicID) return
        const signature = generateSHA1(`public_id=${publicID}&timestamp=${timestamp}${apiSecret}`).toString();
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
        let data = new FormData()
        data.append("public_id", publicID)
        data.append("signature", signature)
        data.append("api_key", apiKey)
        data.append("timestamp", timestamp.toString())
        await fetch(url, {
            method: 'POST',
            body: data
        }).then((response) => response.json()).then((data) => console.log(data))
    }
    catch(e) {
        console.log("ERROR")
        console.log(e)
        return ``
    }
}



export {imageUpload, imagePfpUpload, imageDelete}
