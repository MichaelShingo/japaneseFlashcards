import useToast from "@/app/customHooks/useToast";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { Card } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import ArrayInput from "../../atoms/ArrayInput/ArrayInput";

export type CardUpsertFormData = {
  japanese: string;
  japaneseSynonyms: string[];
  english: string;
  englishSynonyms: string[],
  hint: string,
};

interface CardUpsertModalProps {
  open: boolean;
  onClose: () => void;
  card: Card;
  isEdit?: boolean;
}

const CardUpsertModal: FC<CardUpsertModalProps> = ({ open, onClose, card, isEdit }) => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<CardUpsertFormData>({
    defaultValues: {
      japanese: '',
      japaneseSynonyms: [],
      english: '',
      englishSynonyms: [],
      hint: '',
    }
  });

  useEffect(() => {
    if (isEdit && card) {
      reset({
        japanese: card.japanese,
        japaneseSynonyms: card.japaneseSynonyms,
        english: card.english,
        englishSynonyms: card.englishSynonyms,
        hint: card.hint,
      });
    }
  }, [isEdit, card, reset]);

  const { mutate: postMutate, isPending: postIsPending } = useMutation({
    mutationFn: async (newCard: CardUpsertFormData) => {
      const response = await fetch('api/cards/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });
      return response.json();
    },
    onSuccess: () => {
      toast('Successfully added a card.');
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (error: Error) => {
      toast(error.message);
    }
  });

  const { mutate: patchMutate, isPending: patchIsPending } = useMutation({
    mutationFn: async (updatedCard: CardUpsertFormData) => {
      const response = await fetch(`/api/cards/${card!.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast('Successfully edited card.');
      queryClient.invalidateQueries();
      onClose();
    },
    onError: (error: Error) => {
      toast(error.message);
    }
  });


  const onSubmit: SubmitHandler<CardUpsertFormData> = (data) => {
    console.log("🚀 ~ data:", data);
    isEdit ? patchMutate(data) : postMutate(data);
  };

  return (
    <Dialog
      open={open}
      maxWidth='xs'
      fullWidth
    >
      <DialogTitle>{isEdit ? 'Edit Card' : 'Add Card'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box className="flex flex-col gap-7 mt-2">
            <Controller
              name="japanese"
              control={control}
              rules={{ required: 'Japanese word cannot be blank.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Japanese*"
                  variant="outlined"
                  error={!!errors.japanese}
                  helperText={errors.japanese ? errors.japanese.message : ''}
                  fullWidth
                />
              )}
            />
            <Controller
              name="japaneseSynonyms"
              control={control}
              render={({ field }) => (
                <ArrayInput
                  field={field}
                  label="Japanese Synonyms"
                  placeholder="Add synonyms"
                />
              )}
            />
            <Controller
              name="english"
              control={control}
              rules={{ required: 'English word cannot be blank.' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="English*"
                  variant="outlined"
                  error={!!errors.english}
                  helperText={errors.english ? errors.english.message : ''}
                  fullWidth
                />
              )}
            />
            <Controller
              name="englishSynonyms"
              control={control}
              render={({ field }) => (
                <ArrayInput
                  field={field}
                  label="English Synonyms"
                  placeholder="Add synonyms"
                />
              )}
            />
            <Controller
              name="hint"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Hint"
                  variant="outlined"
                  // error={!!errors.hint}
                  // helperText={errors.japanese ? errors.japanese.message : ''}
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button loading={isEdit ? patchIsPending : postIsPending} type="submit">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CardUpsertModal;