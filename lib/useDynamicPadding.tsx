import { useState, useEffect } from 'react';

const useDynamicPadding = (smallCutOff: number, mediumCutOff: number, smallPadding: string, mediumPadding: string, largePadding: string): string => {
  const [paddingValue, setPaddingValue] = useState("");

  useEffect(() => {
    // Function to calculate and set the padding value based on window.innerWidth
    const setPaddingBasedOnWindowWidth = () => {
      const windowWidth = window.innerWidth;
      let padding: string;

      if (windowWidth < smallCutOff) padding = smallPadding;
      else if (windowWidth < mediumCutOff) padding = mediumPadding;
      else padding = largePadding;

      setPaddingValue(padding);
    };

    setPaddingBasedOnWindowWidth();
    window.addEventListener("resize", setPaddingBasedOnWindowWidth);

    return () => {
      window.removeEventListener("resize", setPaddingBasedOnWindowWidth);
    };
  }, [smallCutOff, mediumCutOff, smallPadding, mediumPadding, largePadding]);

  return paddingValue;
};

export default useDynamicPadding;
