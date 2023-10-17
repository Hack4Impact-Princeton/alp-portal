import React, { useState } from "react";
import * as d3 from "d3";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [json, setJson] = useState({ body: "" });

  // set uploaded csv file as selectedFile
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // go inside csv file and extract (for now) first book drive
  const handleUploadCSV = () => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;

      // Use D3.js to parse the CSV data
      const parsedData = d3.csvParse(csvData);

      // Now you can work with the parsed data
      console.log(parsedData);

      const testDataCase = parsedData[0];

      let testBookDriveJson = {
        driveName: `${testDataCase["Book Drive Name"]}`,
        driveCode: `${testDataCase["Book Drive Code"]}`,
        organizer: `${testDataCase["Contact: Full Name"]}`,
        startDate: `${new Date()}`,
        country: `USA`,
        status: 0,
        booksGoal: 1000,
        completedDate: `${new Date()}`,
        mailDate: `${new Date()}`,
        reactivationRequestId: null,
        gs: {
          fundraise: "fundraise",
          terms: true,
        },
        cb: {
          booksCurrent: 0,
          updateFreq: 0,
          lastUpdate: `${new Date()}`,
        },
        pts: {
          intFee: 0,
          domFee: 0,
          materials: {
            boxes: false,
            extraCardboard: false,
            tape: false,
            mailingLabels: false,
          },
        },
        fl: {
          isFinalized: false,
          shipments: [],
        },
      };
      setJson(testBookDriveJson);
    };

    reader.readAsText(selectedFile);
  };

  const uploadDrive = async () => {
    //console.log(JSON.stringify(json));
    console.log("Uploading Drive to Mongo");
    console.log(json["driveCode"]);
    try {
      await fetch(`/api/bookDrive/${json["driveCode"]}`, {
        method: "POST",
        body: JSON.stringify(json),
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div>
        <h4 className="page-header mb-4">Upload a CSV</h4>
        <div className="mb-4">
          <input
            disabled={uploading}
            type="file"
            className="form-control"
            onChange={changeHandler}
          />
        </div>
        <button
          onClick={handleUploadCSV}
          disabled={uploading}
          className="btn btn-primary"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <button onClick={uploadDrive} className="btn btn-primary">
          Testing
        </button>
      </div>
      <div>
        <h4> Testing Testing </h4>
      </div>
    </div>
  );
};

Upload.propTypes = {};

export default Upload;
