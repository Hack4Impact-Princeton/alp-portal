import { Grid, Box, Button } from "@mui/material";
type RecipientListProps = {
  recipients: string[];
  onClear: () => void;
  onRemove: (email: string) => void;
  onAddAll: () => void;
};
const RecipientList: React.FC<RecipientListProps> = ({
  recipients,
  onClear,
  onRemove,
  onAddAll,
}) => {
  return (
    <Grid container sx={{ pt: 2 }}>
      {recipients &&
        recipients.map((recipient) => {
          return (
            <Grid >
              <Box
                key={recipient}
                display="flex"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "2px",
                  padding: 2,
                  paddingLeft:0.5,
                  width: "fit-content",
                  borderRadius:"10%",
                  margin: 0.5,
                  backgroundColor:"white"
                }}
              >
                <button
                  onClick={() => onRemove(recipient)}
                  style={{
                    fontWeight: "400",
                    cursor: "pointer",
                    textAlign:"center",
                    border:"none"
                  }}
                >
                  x
                </button>
                <p style={{ paddingLeft: 10 }}>{recipient}</p>
                
              </Box>
            </Grid>
          );
        })}
      <Grid item xs={7} sx={{}}>
        <Button
          onClick={onAddAll}
          variant="outlined"
          size="large"
          style={{ padding: 5, cursor: "pointer" }}
        >
          Add all volunteers
        </Button>
      </Grid>
      <Grid item xs={5}>
        <Button
          onClick={onClear}
          variant="outlined"
          size="large"
          style={{
            display: "flex",
            width: "fit-content%",
            padding: 5,
            cursor: "pointer",
          }}
        >
          Clear all
        </Button>
      </Grid>
    </Grid>
  );
};

export default RecipientList;
