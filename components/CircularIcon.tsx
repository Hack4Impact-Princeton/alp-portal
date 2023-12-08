
const CircularIcon: React.FC<{ stringContent?: string | null, reactNodeContent?: React.ReactNode | null, bgColor: string, fgColor?: string, diameter?: string, onClick?: () => void }> = ({ stringContent, reactNodeContent, bgColor, fgColor, diameter, onClick }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" onClick={onClick} width={diameter ? diameter : "28"} height={diameter ? diameter : "28"} viewBox="0 0 28 28" fill="none">
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
