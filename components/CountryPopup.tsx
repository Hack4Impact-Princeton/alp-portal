import { CountryData } from './MapComponent'
import Box from '@mui/material/Box';

type CountryPopupProps = {
    data: CountryData | undefined;
}
export const CountryPopup: React.FC<CountryPopupProps> = ({ data }) => {
     if (data) return (
        <Box sx={{
            width: "100%",
            height: data ? "auto" : "36px",
            border: '1.5px solid black',
            display: 'flex',
            marginRight: "10px",
            marginLeft: "10px",
            flexDirection: "column",
            paddingTop: 1,
            backgroundColor: "#F5F5F5"
        }}>
            <div style={{ paddingLeft: 2 }}>
                <p style={{ textAlign: "left", fontWeight: 800, textDecoration: "underline", marginBottom: 4 }}>{data ? `${data.country}:` : ""}</p>
                <p style={{ textAlign: "left" }}>{data ? `Books donated: ${data.value}` : ""}</p>
            </div>
        </Box>
    )
    return <></>
}