import { BookDrive } from "../models/BookDrive";
import { deadlineMap } from "./enums";
import CircularIcon from "../components/CircularIcon";
import { BookDriveStatus } from "./enums";
export const isDeadlineApproaching = (country: string): boolean => {
  // TODO implement deadline logic here based on date and current time
  if (!country) throw new Error("Something went wrong - country is undefined");
  if (!deadlineMap.has(country))
    throw new Error(`${country} does not exist in deadline map`);
  return (
    deadlineMap.get(country)!.getTime() - new Date().getTime() <
    31 * 24 * 60 * 60 * 1000
  );
};

export const halfDrive = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25ZM12.5 23.8015C18.7416 23.8015 23.8014 18.7417 23.8014 12.5001C23.8014 6.25853 18.7416 1.19873 12.5 1.19873C6.25842 1.19873 1.19863 6.25853 1.19863 12.5001C1.19863 18.7417 6.25842 23.8015 12.5 23.8015Z"
      fill="#5F5F5F"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.95675e-10 12.5C4.95675e-10 12.5 0 12.5001 0 12.5001C0 19.4037 5.59644 25.0001 12.5 25.0001C19.4036 25.0001 25 19.4037 25 12.5001C25 12.5001 25 12.5 25 12.5H4.95675e-10Z"
      fill="#5F5F5F"
    />
  </svg>
);
export const fullDrive = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
  >
    <circle cx="12.5" cy="12.5" r="12.5" fill="#5F5F5F" />
  </svg>
);

export const getDriveNameCell = (driveName: string, drives: BookDrive[]) => {
  const foundDrive = drives?.find((drive) => drive.driveName === driveName);
  if (foundDrive)
    return (
      <span
        style={{
          textDecoration: "underline",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "normal",
        }}
      >
        {foundDrive?.status === BookDriveStatus.Cancelled ? (
          <div style={{ marginRight: 8 }}>
            <CircularIcon
              stringContent="!"
              bgColor={"#F3D39A"}
              fgColor={"#5F5F5F"}
            />
          </div>
        ) : (
          <></>
        )}
        {isDeadlineApproaching(foundDrive.country) ? (
          <div style={{ marginRight: 8 }}>
            <CircularIcon
              bgColor={"F3D39A"}
              reactNodeContent={
                <>
                  <circle cx="14" cy="14" r="14" fill="#F3D39A" />
                  <circle
                    cx="14"
                    cy="14"
                    r="9"
                    stroke="#5F5F5F"
                    strokeWidth="2"
                  />
                  <circle cx="14" cy="14" r="1" fill="#5F5F5F" />
                  <rect
                    x="12.6479"
                    y="6.60059"
                    width="2"
                    height="7.46818"
                    rx="1"
                    transform="rotate(-3.48103 12.6479 6.60059)"
                    fill="#5F5F5F"
                  />
                  <rect
                    x="17.9458"
                    y="12"
                    width="2.00318"
                    height="4.03109"
                    rx="1.00159"
                    transform="rotate(78.1979 17.9458 12)"
                    fill="#5F5F5F"
                  />
                </>
              }
            />{" "}
          </div>
        ) : (
          <></>
        )}
        {driveName}
      </span>
    );
  else return <span></span>;
};
