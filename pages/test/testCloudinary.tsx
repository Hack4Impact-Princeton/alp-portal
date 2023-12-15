import { NextPage } from "next";
import { useState } from "react";
import {imagePfpUpload, imageDelete, imageUpload} from "../../db_functions/imageDB"
type props = {

}
const testCloudinary: NextPage<props> = ({}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [publicID, setPublicID] = useState<string>("");
    const [URL, setSelectedURL] = useState("")

    const changeHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return
        setSelectedFile(event.target.files[0]);
    }
    const handleUpload = async () => {
        if (!selectedFile) return
        console.log(selectedFile)
        const url = await imageUpload(selectedFile)
        console.log(url)
        setSelectedURL(url)
    }
    const handleDelete = async ()=> {
        if(URL == "") return
        imageDelete(URL)
    }

    return (
        <div>
            <div>
                <input type="file" name="file" onChange={changeHandler} />
                <button onClick={handleUpload}>upload here</button>
            </div>
            <div>
                <p>upload url: {URL}</p>
            </div>
            <div>
                <img style={{width:"25%", height: "25%"}} src={URL} ></img>
            </div>
            <div>
                <button onClick={handleDelete}>delete here</button>
            </div>
        </div>
        
    )
}
export default testCloudinary