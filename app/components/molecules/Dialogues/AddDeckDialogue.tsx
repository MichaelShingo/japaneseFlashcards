import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, TextField } from "@mui/material";
import { FC } from "react";

interface AddDeckDialogueProps {
  open: boolean;
  onClose: () => void;

}

const DeckUpsertDialogue: FC<AddDeckDialogueProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
    >
      <DialogTitle>Add Deck</DialogTitle>
      <DialogContent>
        <FormControl>
          <TextField
            autoFocus
            required
            id="title"
            label="Title"
            variant="outlined"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeckUpsertDialogue;