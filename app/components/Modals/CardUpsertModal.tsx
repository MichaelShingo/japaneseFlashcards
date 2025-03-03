import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from '@mui/material';
import { Card } from '@prisma/client';
import { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import ArrayInput from '../ArrayInput';
import useQueryFunctions from '@/app/queries/useCardQueries';

export type CardUpsertFormData = {
	japanese: string;
	japaneseSynonyms: string[];
	english: string;
	englishSynonyms: string[];
	hint: string;
};

interface CardUpsertModalProps {
	open: boolean;
	onClose: () => void;
	card: Card;
	isEdit?: boolean;
}

const CardUpsertModal: FC<CardUpsertModalProps> = ({ open, onClose, card, isEdit }) => {
	const { mutatePatch, isPendingPatch, mutatePost, isPendingPost } =
		useQueryFunctions(onClose);

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CardUpsertFormData>({
		defaultValues: {
			japanese: '',
			japaneseSynonyms: [],
			english: '',
			englishSynonyms: [],
			hint: '',
		},
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

	const onSubmit: SubmitHandler<CardUpsertFormData> = (data) => {
		isEdit ? mutatePatch({ ...card, ...data }) : mutatePost({ ...card, ...data });
	};

	return (
		<Dialog open={open} maxWidth="xs" fullWidth onClose={onClose} disableRestoreFocus>
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
									autoFocus
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
					<Button loading={isEdit ? isPendingPatch : isPendingPost} type="submit">
						Save
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default CardUpsertModal;
