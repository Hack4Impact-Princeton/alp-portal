import React from 'react';

const CircularIIcon: React.FC<{flipCard: () => void}> = ({flipCard}) => {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 70 70" fill="none" style={{cursor: "pointer"}} onClick={flipCard}>
        <circle cx="35" cy="35" r="35" fill="#FE9834" />
        <text
        fill="#FFFFFF"
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
            fontSize: "45px",
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
            zIndex: 400,
          }}
        >
          i
        </text>
      </svg>
    </>
  );
};

export default CircularIIcon;


// style={{display: "flex", width: 20, height: 18, flexDirection: "column", justifyContent: "center", flexShrink: 0, color: "#FFF", textAlign: "center", fontFamily: "Epilogue", fontSize: "45px", fontStyle: "normal", fontWeight: 800, lineHeight: "normal", zIndex: 100}}