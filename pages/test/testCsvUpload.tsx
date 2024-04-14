import React, { useState, ChangeEvent } from "react";
import { BookDrive } from "../../models/BookDrive";
import { DSVRowString } from "d3-dsv";
import * as d3 from "d3";
import Papa from 'papaparse';

const fieldsToCheck = ["driveName", "driveCode", "organizer", "country"];

type UploadProps = {};


type ErrorDriveMap = Map<number, string>;


function hasBlankFields(obj: BookDrive, fieldsToCheck: string[]): string {
  for (const field of fieldsToCheck) {
    let value = obj[field];
    if (value === "" || value === null) {
      return field; // At least one blank field found
    }
  }
  return ""; // No blank fields found
}

const Upload: React.FC<UploadProps> = () => {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [bookDrives, setBookDrives] = useState<BookDrive[]>([]); // Provide the correct initial type
  const [errorDriveMap, setErrorDriveMap] = useState(new Map());
  const [dupList, setDupList] = useState<string[]>([]);

  // set uploaded csv file as selectedFile
  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setSelectedFile(selectedFiles[0]);
      setUploaded(true);
    }
  };

  // go inside csv file and extract (for now) first book drive
  const handleUploadCSV = () => {

    if (!selectedFile) return;
    console.log(selectedFile)
    let data: Record<any, any>[] = []
    Papa.parse(selectedFile, {
      complete: function (results: any) {
        console.log("Finished:", results.data);
        console.log("Finished:", results.data[1]);
        let drives: BookDrive[] = []
        for (let i = 1; i < results.data.length; i++) {
          let drive: Record<any, any> = {};
          for (let j = 0; j < (results.data[0] as any).length; j++) 
            drive[(results.data[0] as Array<string>)[j]] = (results.data[i] as any)[j]
          drives.push({
            driveName: `${drive["Book Drive Name"]}`,
            driveCode: `${drive["Book Drive Code"]}`,
            organizer: `${drive["Contact: Full Name"]}`,
            email: `${drive["Contact Email"]}`,
            startDate: new Date(),
            country: `${drive["Country: Countries Name"]}`,
            status: 0,
            booksGoal: (drive["Book Drive Name"].endsWith('h drive')) ? 500 : 1000,
            completedDate: new Date(),
            mailDate: new Date(),
            reactivationRequestId: "",
            gs: {
              fundraise: "fundraise",
              terms: true,
            },
            cb: {
              booksCurrent: parseInt(drive["Books Sent"]),
              updateFreq: 0,
              lastUpdate: new Date(),
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
          })
        }
        setBookDrives(drives)
      }
    });

  };

  const uploadDrives = async () => {
    console.log("Uploading Drive to Mongo");
    setErrorDriveMap(new Map());
    let dup : string[] = []
    for (let i = 0; i < bookDrives.length; i++) {
      // if any missing fields, don't upload drive and tell that there is an error
      const missingField = hasBlankFields(bookDrives[i], fieldsToCheck);
      if (missingField !== "") {
        setErrorDriveMap(
          (map) =>
            new Map(
              map.set(
                i,
                "The following information is missing: " + missingField
              )
            )
        );
        continue;
      }
      try {
        const response = await fetch(
          `/api/bookDrive/${bookDrives[i]["driveCode"]}`,
          {
            method: "POST",
            body: JSON.stringify(bookDrives),
          }
        );

        if (response.ok) {
          console.log(
            `Uploaded book drive with code: ${bookDrives[i]["driveCode"]}`
          );
        } else {
          dup.push(bookDrives[i].driveCode)
        }
      } catch (e) {
        console.log(e);
      }
    }
    setDupList(dup);
    
  };

  return (
    <div>
      <div>
        <h4 className="page-header mb-4">Upload a CSV</h4>
        <div className="mb-4">
          <input
            type="file"
            className="form-control"
            onChange={changeHandler}
          />
        </div>
        <button
          onClick={handleUploadCSV}
          disabled={!uploaded}
          className="btn btn-primary"
        >
          {uploaded ? "Parse Different Drives" : "Parse Drives"}
        </button>
        <button
          onClick={uploadDrives}
          disabled={!uploaded}
          className="btn btn-primary"
        >
          Upload Bookdrives
        </button>
      </div>
      <div>
        {errorDriveMap.size !== 0 && (
          <div>
            Erroring Drives:
            <ul>
              {Array.from(errorDriveMap.entries()).map(([key, value]) => (
                <li key={key}>
                  Drive on line {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div>
        {dupList.length !== 0 && (
          <div>
            <li >The following driveIDs have already been uploaded: {dupList.toString()} </li>
          </div>
        )}
      </div>
    </div>
  );
};

Upload.propTypes = {};

export default Upload;
