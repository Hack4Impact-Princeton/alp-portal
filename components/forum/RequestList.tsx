import Grid2 from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import RequestPreview from "./RequestPreview";

const RequestList: React.FC<{}> = () => {
  return (
    <>
      <Grid2>
        <h3>beginning of friend requests</h3>
        <RequestPreview />
      </Grid2>
    </>
  );
};

export default RequestList;
