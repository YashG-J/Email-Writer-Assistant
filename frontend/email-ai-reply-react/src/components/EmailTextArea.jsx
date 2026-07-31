import { TextField } from "@mui/material";

function EmailTextArea(props) {
  return <TextField fullWidth multiline rows={6} variant="outlined" {...props} />;
}

export default EmailTextArea;
