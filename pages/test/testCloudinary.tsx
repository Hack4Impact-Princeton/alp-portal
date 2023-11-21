import { NextPage } from "next";
import { useState } from "react";
import {imageUpload, imageDelete} from "../../db_functions/imageDB"
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
    const textHandler = async (event : React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.value) return
        setPublicID(event.target.value);
    }
    const handleUpload = async () => {
        if (!selectedFile) return
        console.log(selectedFile)
        const url = await imageUpload(selectedFile, publicID)
        console.log(url)
        setSelectedURL(url)
    }
    const handleDelete = async ()=> {
        if(URL == "") return
        imageDelete(publicID)
    }

    return (
        <div>
            <div>
                <input type="file" name="file" onChange={changeHandler} />
                <input type="text" name="text" onChange={textHandler} />
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