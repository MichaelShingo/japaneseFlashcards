import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Select, Snackbar, TextField, Tooltip } from "@mui/material";
import { StudyMode } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, Ref, SetStateAction, useState } from "react";
import HelpIcon from '@mui/icons-material/Help';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Dispatch } from "@reduxjs/toolkit";
import { setSnackBarData, SnackbarData } from "@/redux/features/globalSlice";
import { useAppSelector } from "@/redux/store";
import { useDispatch } from "react-redux";

interface DeckUpsertDialogueProps {
  open: boolean;
  onClose: () => void;
}

type FormData = {
  title: string;
  description: string;
  isPublic: boolean;
  studyModeId: string;
};

const DeckUpsertDialogue: FC<DeckUpsertDialogueProps> = ({ open, onClose, }) => {
  const snackBarData: SnackbarData = useAppSelector((state) => state.globalReducer.value.snackBarData);
  const dispatch = useDispatch();

  const queryClient = useQueryClient();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
      studyModeId: '1',
    }
  });

  const { data, isPending } = useQuery({
    queryKey: ['studyModes'],
    queryFn: async () => {
      const response = await fetch('/api/studymodes');
      return await response.json();
    }
  });

  const mutation = useMutation({
    mutationFn: async (newDeck: FormData) => {
      const response = await fetch('api/decks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeck),
      });
      if (!response.ok) {
        console.log('toast');
      }
      return response.json();
    },
    onSuccess: () => {
      dispatch(setSnackBarData({ isOpen: true, message: 'Successfully added a deck.' }));
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (error: Error) => {
      dispatch(setSnackBarData({ isOpen: true, message: 'Failed to add a deck.' }));

    }
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    mutation.mutate(data);
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
          <Button type="submit">Save</Button>
        </DialogActions>
      </form>

    </Dialog >
  );
};

export default DeckUpsertDialogue;