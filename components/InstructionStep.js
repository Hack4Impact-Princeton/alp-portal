import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const InstructionStep = () => {
  // Props for optional rendering. Set false to hide image
  const [cardImagePresent, setCardImage] = useState(true);
  let url =
    "https://www.producemarketguide.com/sites/default/files/Commodities.tar/Commodities/carrots_commodity-page.png";
  let cardImage = <img src={url} alt="alp-logo" height="170px" align="right" />;

  const basicCard = (
    <CardContent display="flex">
      <Typography
        display="inline-block" // allows image to be placed inline with text
        width={cardImagePresent ? "75%" : "100%"} // width of text hardcoded to 75% if image present, 100% otherwise
        sx={{ fontSize: 16 }}
        marginRight="20px"
        color="text.secondary"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum. Risus sed vulputate odio ut enim blandit
        volutpat maecenas volutpat. Morbi non arcu risus quis varius quam
        quisque id. Amet purus gravida quis blandit turpis cursus.
      </Typography>
      {cardImagePresent && cardImage}
    </CardContent>
  );

  return (
    <div>
      <h1
        style={{
          color: "#777777",
          margin: "50px 80px 30px 200px",
        }}
      >
        STEP 2: TITLE
        <IconButton aria-label="dropdown">
          <ArrowDropDownIcon />
        </IconButton>
      </h1>
      <Card
        sx={{
          border: "solid 4px orange",
          borderRadius: 2,
          margin: "30px 175px 100px 175px",
          padding: "50px 60px 40px 60px", // less padding on bottom to offset card component bottom
        }}
        variant="outlined"
      >
        {basicCard}
      </Card>
    </div>
  );
};

export default InstructionStep;
