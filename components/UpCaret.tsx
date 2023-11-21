const UpCaret: React.FC<{onClick: () => void, bgColor: string}> = ({onClick, bgColor}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="38" viewBox="0 0 34 38" fill="none" onClick={onClick} style={{cursor: "pointer"}}>
        <g clipPath="url(#clip0_877_424)">
            <path d="M16.5529 16.929L23.2281 24.6614L25.1766 22.4892L16.5946 12.548L7.82517 22.3243L9.73198 24.5331L16.5529 16.929Z" fill={bgColor? bgColor : "#FE9834"} />
        </g>
        <defs>
            <clipPath id="clip0_877_424">
                <rect width="37.1811" height="32.7194" fill="white" transform="matrix(0.00950428 -0.999955 -0.999955 -0.00950428 32.718 37.4902)" />
            </clipPath>
        </defs>
    </svg>
    )
}
export default UpCaret