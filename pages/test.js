import InstructionGroupCard from "../components/InstructionGroup";
import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";


function Test() {
    return (
        <Grid>
        <InstructionGroupCard completed={true} header={"Getting Started"}></InstructionGroupCard>
        <InstructionGroupCard completed={false} header={"Collecting Books"}></InstructionGroupCard>
        </Grid>
    );
}
export default Test