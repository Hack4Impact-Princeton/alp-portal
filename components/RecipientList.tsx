import { Grid, Box } from '@mui/material'
type RecipientListProps = {
    recipients: string[],
    onClear: () => void,
    onRemove: (email: string) => void
    onAddAll: () => void,
}
const RecipientList: React.FC<RecipientListProps> = ({ recipients, onClear, onRemove, onAddAll }) => {
    return (
        <Grid container spacing="10" display="flex" sx={{ flexDirection: "column", width: 'fit-content', height: 'auto', margin: 1, padding: 2, border: '2.5px solid black', alignItems: "center", justifyContent: "center" }}>
            <button onClick={onAddAll} style={{padding: 3, cursor: "pointer"}}>Add all volunteers</button>
            {recipients && recipients.map(recipient => {
                return (
                    <Grid item> 
                        <Box key={recipient} display="flex" sx={{ justifyContent: "space-between", alignItems: "center", height: "2px", padding: 2, width: "fit-content", border: '1.5px solid gray' }}>
                            <h4 style={{ paddingRight: 10 }}>{recipient}</h4>
                            <button onClick={() => onRemove(recipient)} style={{backgroundColor: "red", borderRadius: "30%", color: "black", fontWeight: "1000", cursor: "pointer"}}>x</button>
                        </Box> 
                    </Grid>)
            })
            }
            <button onClick={onClear} style={{ display: "flex", width: "fit-content%", justifyContent: "center", marginTop: 5, marginBottom: 3, cursor: "pointer" }}>Clear all</button>
        </Grid >
    )
}

export default RecipientList