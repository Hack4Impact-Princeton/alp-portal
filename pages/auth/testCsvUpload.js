import React, { useState } from "react";
import * as d3 from "d3";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  }

  const handleUploadCSV = () => {

    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;

      // Use D3.js to parse the CSV data
      const parsedData = d3.csvParse(csvData);

      // Now you can work with the parsed data
      console.log(parsedData);

      // Perform any further processing or rendering with the parsed data here
    };

    reader.readAsText(selectedFile);
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
        <h4> Testing Testing </h4>
      </div>
    </div>
  );
};

Upload.propTypes = {};

export default Upload;
