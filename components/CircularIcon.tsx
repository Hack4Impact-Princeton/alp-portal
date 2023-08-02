
const CircularIcon: React.FC<{ stringContent?: string | null, reactNodeContent?: React.ReactNode | null, bgColor: string, fgColor?: string }> = ({ stringContent, reactNodeContent, bgColor, fgColor }) => {
    if (reactNodeContent) console.log("YAAAA")
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="14" fill={bgColor} />
            {reactNodeContent && reactNodeContent}
            {stringContent &&
                <text
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
                        fontSize: "25px",
                        fontStyle: "normal",
                        fontWeight: 1000,
                        lineHeight: "normal",
                        zIndex: 400,
                    }}
                >
                    {stringContent}
                </text>
            }
        </svg>
    )

}

export default CircularIcon

/* 
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
<rect x="7" y="10" width="14" height="9" stroke="#5F5F5F" stroke-width="2" />
<path d="M12.80216 15.82011C13.19047 16.19844 13.80953 16.19844 14.19784 15.82011L18.6666 11.46626C19.3093 10.84016 18.866 9.75 17.9688 9.75H9.0312C8.134 9.75 7.69074 10.84016 8.33337 11.46626L12.80216 15.82011Z" stroke="#5F5F5F" stroke-width="2" />
</svg>
*/