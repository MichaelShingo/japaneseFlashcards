import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Select, TextField, Tooltip } from "@mui/material";
import { StudyMode } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import HelpIcon from '@mui/icons-material/Help';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ExtendedDeck } from "@/app/api/decks/route";
import useToast from "@/app/customHooks/useToast";

export interface DeckUpsertModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  deck?: ExtendedDeck;
}

type FormData = {
  title: string;
  description: string;
  isPublic: boolean;
  studyModeId: string;
};

const DeckUpsertModal: FC<DeckUpsertModalProps> = ({ open, onClose, isEdit, deck }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
      studyModeId: '1',
    }
  });

  useEffect(() => {
    if (isEdit && deck) {
      reset({
        title: deck.title,
        description: deck.description,
        isPublic: deck.isPublic,
        studyModeId: String(deck.studyModeId),
      });
    }
  }, [isEdit, deck, reset]);

  const { data, isPending } = useQuery({
    queryKey: ['studyModes'],
    queryFn: async () => {
      const response = await fetch('/api/studymodes');
      return await response.json();
    }
  });

  const { mutate: postMutate, isPending: postIsPending } = useMutation({
    mutationFn: async (newDeck: FormData) => {
      const response = await fetch('api/decks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeck),
      });
      return response.json();
    },
    onSuccess: () => {
      toast('Successfully added a deck.');
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (error: Error) => {
      toast(error.message);
    }
  });

  const { mutate: patchMutate, isPending: patchIsPending } = useMutation({
    mutationFn: async (updatedDeck: FormData) => {
      console.log(`api/decks/${deck!.id}`);
      const response = await fetch(`api/decks/${deck!.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDeck),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: () => {
      toast('Successfully edited deck.');
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (error: Error) => {
      toast(error.message);
    }
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    isEdit ? patchMutate(data) : postMutate(data);
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>Add Deck</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)} >
        <DialogContent>
          <Box className="flex flex-col gap-3 mt-2" >

            <Controller
              name="title"
              control={control}
              rules={{ required: 'Please enter a title.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title*"
                  variant="outlined"
                  error={!!errors.title}
                  helperText={errors.title ? errors.title.message : ''}
                  fullWidth
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  variant="outlined"
                  multiline
                  minRows={3}
                  fullWidth
                />
              )}
            />
            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} checked={field.value} />}
                  label="Make this deck available publicly."
                />
              )}
            />
            {isPending ?
              <CircularProgress />
              :
              <Controller
                name="studyModeId"
                control={control}
                render={({ field }) => (
                  <Select
                    id="studyModeId"
                    {...field}
                    className="[&_.MuiSelect-select]:flex"
                  >
                    {data?.map((mode: StudyMode) => (
                      <MenuItem key={mode.id} value={mode.id}>{mode.name}
                        <Tooltip className="ml-2" title={mode.description as string} placement="right">
                          <HelpIcon />
                        </Tooltip>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            }
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button loading={isEdit ? patchIsPending : postIsPending} type="submit">Save</Button>
        </DialogActions>
      </form>

    </Dialog >
  );
};

export default DeckUpsertModal;