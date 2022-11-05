import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const InstructionStepCard = () => {
  // Props for optional rendering. Set false to hide image
  const [cardImagePresent, setCardImage] = useState(true);
  let url =
    "https://www.producemarketguide.com/sites/default/files/Commodities.tar/Commodities/carrots_commodity-page.png";
  let cardImage = (
    <img
      src={url}
      alt="alp-logo"
      height="150px" // currently enforcing uniform height for images
      margin-right="auto" // not working (still flushes left)
      border="10px"
      border-color="red"
    />
  );

  const basicCard = (
    <CardContent>
      <Typography
        display="inline-block"
        width={cardImagePresent ? "75%" : "100%"} // width of text currently hardcoded to 75% if image present, 100% otherwise
        sx={{ fontSize: 16 }}
        marginRight="20px"
        color="text.secondary"
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ullamcorper sit amet
        risus nullam eget felis eget nunc lobortis. Nec ultrices dui sapien eget
        mi proin sed libero. Tincidunt dui ut ornare lectus sit amet est. Eget
        velit aliquet sagittis id consectetur purus ut. Congue eu consequat ac
        felis. Erat imperdiet sed euismod nisi porta lorem mollis. Feugiat
        pretium nibh ipsum consequat nisl vel pretium. Tempor commodo
        ullamcorper a lacus. A cras semper auctor neque vitae tempus quam. Sem
        integer vitae justo eget magna. Volutpat commodo sed egestas egestas
        fringilla phasellus. Felis donec et odio pellentesque diam volutpat
        commodo.
      </Typography>
      {cardImagePresent && cardImage}
    </CardContent>
  );

  return (
    <Card
      sx={{
        border: "solid 4px orange",
        borderRadius: 2,
        margin: "40px 100px 60px 100px",
        padding: "50px 60px 40px 60px", // less padding on bottom to offset card component bottom
      }}
      variant="outlined"
    >
      {basicCard}
    </Card>
  );
};

export default InstructionStepCard;
