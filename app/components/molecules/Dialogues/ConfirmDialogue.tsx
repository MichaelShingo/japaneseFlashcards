import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { FC } from "react";

interface ConfirmDialogueProps {
  open: boolean;
  text: string;
  onClose: () => void;
  confirmAction: () => void;
}

const ConfirmDialogue: FC<ConfirmDialogueProps> = ({ open, text, onClose, confirmAction }) => {
  return (
    <Dialog
      open={open}
    >
      <DialogTitle>Add Deck</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={confirmAction} type="submit">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialogue;