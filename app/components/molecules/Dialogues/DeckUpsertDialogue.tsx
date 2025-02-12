import { Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { StudyMode } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import HelpIcon from '@mui/icons-material/Help';

interface DeckUpsertDialogueProps {
  open: boolean;
  onClose: () => void;

}

const DeckUpsertDialogue: FC<DeckUpsertDialogueProps> = ({ open, onClose }) => {
  const [studyMode, setStudyMode] = useState<string>('Study Mode');

  const { data, isPending } = useQuery({
    queryKey: ['studyModes'],
    queryFn: async () => {
      const response = await fetch('/api/studymodes');
      return await response.json();
    }
  });

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Add Deck</DialogTitle>
      <DialogContent>
        <FormControl className="flex flex-col gap-3 mt-2" >
          <TextField
            required
            id="title"
            label="Title"
            variant="outlined"
          />
          <FormControlLabel
            control={<Checkbox />}
            label="Make this deck available publicly."
          />
          <TextField
            id="description"
            multiline
            minRows={3}
            label="Description"
            variant="outlined"
          />
          {isPending ?
            <CircularProgress />
            :
            <Select
              id="studyMode"
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              className="[&_.MuiSelect-select]:flex"
            >
              {data?.map((mode: StudyMode) => (
                <MenuItem key={mode.id} value={mode.name}>{mode.name}
                  <Tooltip className="ml-2" title={mode.description as string} placement="right">
                    <HelpIcon />
                  </Tooltip>
                </MenuItem>

              ))}
            </Select>
          }
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog >
  );
};

export default DeckUpsertDialogue;