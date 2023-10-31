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
            <Grid container>
              <Box
                key={recipient}
                display="flex"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: "2px",
                  padding: 2,
                  width: "fit-content",
                  border: "1.5px solid gray",
                  mb: 1,
                }}
              >
                <h4 style={{ paddingRight: 10 }}>{recipient}</h4>
                <button
                  onClick={() => onRemove(recipient)}
                  style={{
                    backgroundColor: "red",
                    borderRadius: "30%",
                    color: "black",
                    fontWeight: "1000",
                    cursor: "pointer",
                  }}
                >
                  x
                </button>
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
