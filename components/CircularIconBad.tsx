import React from 'react';

const CircularIconBad: React.FC<{content: string | React.ReactNode, bgColor: string, fgColor?: string}> = ({content, bgColor, fgColor}) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 70 70" fill="none">
        <circle cx="35" cy="35" r="35" fill={bgColor} />
        {typeof content === 'string' && <text
        fill={fgColor}
          x="50%" // To horizontally center the text
          y="55%" // To vertically center the text
          dominantBaseline="middle" // To vertically center the text (cross-browser)
          textAnchor="middle" // To horizontally center the text (cross-browser)
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexShrink: 0,
            color: "#000000",
            textAlign: "center",
            fontSize: "50px",
            fontStyle: "normal",
            fontWeight: 1000,
            lineHeight: "normal",
            zIndex: 400,
          }}
        >
          {content}
        </text>}
        {typeof content !== 'string' && content}
      </svg>
    </>
  );
};

export default CircularIconBad;