import { CountryData } from './MapComponent'
import Box from '@mui/material/Box';

type CountryPopupProps = {
    data: CountryData | undefined;
}
export const CountryPopup: React.FC<CountryPopupProps> = ({data}) => {
    return (
        <Box sx={{
            width: "100%",
            height: data ? "auto": "36px",
            border: '1.5px solid black',
            display: 'flex',
            marginRight: "10px",
            marginLeft: "10px",
            flexDirection: "column"
          }}>
            {data && 
            <div>
                <p style={{textAlign: "center"}}>{data.country}</p>
                <p style={{textAlign: "center"}}>{`Books donated: ${data.value}`}</p>
            </div>
            }
        </Box>
    )
}