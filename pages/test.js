import InstructionGroupCard from "../components/InstructionGroup";
import InstructionStepCard from "../components/InstructionStepCard";
import * as React from 'react';
import Grid from "@mui/material/Unstable_Grid2";
import InstructionChecklistCard from "../components/InstructionChecklistCard";


function Test() {
    return (
        <Grid>
        <InstructionGroupCard completed={true} header={"Getting Started"}></InstructionGroupCard>
        <InstructionGroupCard completed={false} header={"Collecting Books"}></InstructionGroupCard>
        <InstructionChecklistCard driveCode={1} stepNum={1} heading={"Packing Materials"}></InstructionChecklistCard>
        </Grid>
    );
}
export default Test