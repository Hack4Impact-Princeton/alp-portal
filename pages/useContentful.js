import { useState } from "react";
import { createClient } from "contentful";

const useContentful = () => {
  /* Instantiate the Contentful client */
  const client = createClient({
    /* Currently not working...look into this!
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
        */
    space: "m6c9bviawant",
    accessToken: "nwQdSkPaWs9BtH4LiJXWyzF0d-xGvbLfcxE52_oQHxQ",
  });

  /* Gets the logo content from Contentful Delivery API */
  const getLogos = async () => {
    try {
      const entries = await client.getEntries({
        content_type: "logo",
        select: "fields",
      });

      /* Cleans entries, which contains a lot of information we don't need to render logos.
       * Returns an array of logoImage objects with title, description, and file object. */
      const sanitizedEntries = entries.items.map((item) => {
        const logoImage = item.fields.logoImage.fields;

        return {
          ...item.fields,
          logoImage,
        };
      });

      return sanitizedEntries;

      /* If there's an error, console log the error. */
    } catch (error) {
      console.log(`Error fetching logo: ${error}`);
    }
  };

  /* Gets the Instruction Step Card content */
  const getInstructionStepCards = async () => {
    try {
      const entryItems = await client.getEntries({
        content_type: "instructionStep",
      });

      const entries = entryItems.items.map((entry) => {
        const { fields } = entry;
        return {
          /* untested */
          /* ref: https://github.com/contentful/react-starter/blob/main/src/App.js */
          header: fields.header,
          number: fields.number,
          description: fields.description,
          image: fields.image.fields.file.url,
        };
      });
    } catch (error) {}
  };

  return { getLogos, getInstructionStepCards };
};

export default useContentful;
