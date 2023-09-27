import React, { useState } from "react";
import * as d3 from "d3";

import {handler} from "../api/bookDrive/[code].js"

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const handleUploadCSV = () => {
    // try{
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;

      // Use D3.js to parse the CSV data
      const parsedData = d3.csvParse(csvData);

      // Now you can work with the parsed data
      //for now just doing the very first row. should later extend to doing for all drives.
      let testDataCase = parsedData[0]
      let testBookDriveJson = {
          body: `{
            "driveName": "${testDataCase["Book Drive Name"]}",
            "driveCode": "${testDataCase["Book Drive Code"]}",
            "organizer": "${testDataCase["Book Drive Code"]}",
            "startDate": "${new Date()}",
            "country": "USA",
            "status": "Active",
            "booksGoal": 1000,
            "completedDate": "${new Date()}",
            "mailDate": "${new Date()}",
            "reactivationRequestId": null,
            "gs": {
              "fundraise": "fundraise",
              "terms": true
            },
            "cb": {
              "booksCurrent": 0,
              "updateFreq": 0,
              "lastUpdate": "${new Date()}"
            },
            "pts": {
              "intFee": 0,
              "domFee": 0,
              "materials": {
                "boxes": false,
                "extraCardboard": false,
                "tape": false,
                "mailingLabels": false
              }
            },
            "fl": {
              "isFinalized": false,
              "shipments": []
            }
          }`,
      };

      document.querySelector(".output").innerText = "Testing";
      console.log(testBookDriveJson)
        //reader.readAsText(selectedFile);

        // const response = await fetch(
        //   `/api/bookDrive/${testDataCase["Book Drive Code"]}`,
        //   {
        //     method: "POST",
        //     body: JSON.stringify(testBookDriveJson),
        //   }
        // );
      }
        

        // Perform any further processing or rendering with the parsed data here
    
    //} catch (error) {
    //  console.log(error)
    //}
  };

  return (
    <div>
      <div>
        <h4 className="page-header mb-4">Upload a CSV</h4>
        <div className="mb-4">
          <input disabled={uploading} type="file" className="form-control" onChange = {changeHandler} />
        </div>
        <button
          onClick={handleUploadCSV}
          disabled={uploading}
          className="btn btn-primary"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      <div>
        <h4 className="output"> </h4>
      </div>
    </div>
  );
};

Upload.propTypes = {};

export default Upload;
