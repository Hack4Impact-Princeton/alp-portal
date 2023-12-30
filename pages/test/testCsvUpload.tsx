import React, { useState, ChangeEvent } from "react";
import { DSVRowString } from "d3-dsv";
import * as d3 from "d3";

const fieldsToCheck = ["driveName", "driveCode", "organizer", "country"];

type UploadProps = {};

type BookDrive = {
  driveName: string;
  driveCode: string;
  organizer: string;
  startDate: Date;
  country: string;
  status: number;
  booksGoal: number;
  completedDate: Date;
  mailDate: Date;
  reactivationRequestId: number | null;
  gs: {
    fundraise: string;
    terms: boolean;
  };
  cb: {
    booksCurrent: number;
    updateFreq: number;
    lastUpdate: Date;
  };
  pts: {
    intFee: number;
    domFee: number;
    materials: {
      boxes: boolean;
      extraCardboard: boolean;
      tape: boolean;
      mailingLabels: boolean;
    };
  };
  fl: {
    isFinalized: boolean;
    shipments: any[];
  };
  [key: string]: string | number | boolean | null | Date | Record<string, any>;
};

type ErrorDriveMap = Map<number, string>;

// function hasBlankFields(obj: BookDrive, fieldsToCheck: string[]): string {
//   for (const field of fieldsToCheck) {
//     const value = obj[field];
//     if (value === "" || value === null) {
//       return field; // At least one blank field found
//     }
//   }
//   return ""; // No blank fields found
// }

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
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const csvData: string | ArrayBuffer | null = event.target.result;

        // Use D3.js to parse the CSV data
        if (csvData !== null && typeof csvData === "string") {
          const parsedData = d3.csvParse(csvData);

          // Now you can work with the parsed data
          console.log(parsedData.length);

          const newBookDrives = parsedData.map(
            (
              curBookDrive: DSVRowString<string>,
              index: number,
              array: DSVRowString<string>[]
            ) => ({
              driveName: `${curBookDrive["Book Drive Name"]}`,
              driveCode: `${curBookDrive["Book Drive Code"]}`,
              organizer: `${curBookDrive["Contact: Full Name"]}`,
              startDate: new Date(),
              country: `${curBookDrive["Country Prefrence: Countries Name"]}`,
              status: 0,
              booksGoal: 1000,
              completedDate: new Date(),
              mailDate: new Date(),
              reactivationRequestId: null,
              gs: {
                fundraise: "fundraise",
                terms: true,
              },
              cb: {
                booksCurrent: 0,
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
          );
          setBookDrives(newBookDrives);
        }
      }
    };
    if (selectedFile) {
      const blob = new Blob([selectedFile], { type: "text/csv" });
      reader.readAsText(blob);
    }
    // reader.readAsText(selectedFile);
  };

  const uploadDrives = async () => {
    console.log("Uploading Drive to Mongo");
    setErrorDriveMap(new Map());
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
            body: JSON.stringify(bookDrives[i]),
          }
        );

        if (response.ok) {
          console.log(
            `Uploaded book drive with code: ${bookDrives[i]["driveCode"]}`
          );
        } else {
          setErrorDriveMap(
            (map) =>
              new Map(
                map.set(
                  i,
                  "check if the drive you are trying to input already exists " +
                    response.status
                )
              )
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
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
                  Drive at index {key}: {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

Upload.propTypes = {};

export default Upload;
