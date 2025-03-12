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
import { useCardMutations } from '@/app/queries/useCardQueries';

export type CardUpsertFormData = {
	japanese: string;
	hiragana: string;
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
	deckId: string;
}

const defaultValues = {
	japanese: '',
	hiragana: '',
	japaneseSynonyms: [],
	english: '',
	englishSynonyms: [],
	hint: '',
};

const CardUpsertModal: FC<CardUpsertModalProps> = ({
	open,
	onClose,
	card,
	isEdit,
	deckId,
}) => {
	const {
		mutatePatch,
		isPendingPatch,
		isSuccessPatch,
		mutatePost,
		isPendingPost,
		isSuccessPost,
	} = useCardMutations();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CardUpsertFormData>({
		defaultValues,
	});

	useEffect(() => {
		if (isEdit && card) {
			reset({
				japanese: card.japanese,
				hiragana: card.hiragana,
				japaneseSynonyms: card.japaneseSynonyms,
				english: card.english,
				englishSynonyms: card.englishSynonyms,
				hint: card.hint,
			});
		} else {
			reset(defaultValues);
		}
	}, [isEdit, card, reset]);

	const onSubmit: SubmitHandler<CardUpsertFormData> = (data) => {
		isEdit ? mutatePatch({ ...card, ...data }) : mutatePost({ ...data, deckId });
	};

	useEffect(() => {
		reset(defaultValues);
		onClose();
	}, [isSuccessPatch, isSuccessPost]);

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
									placeholder="漢字・ひらがな・カタカナ"
									error={!!errors.japanese}
									helperText={errors.japanese ? errors.japanese.message : ''}
									fullWidth
								/>
							)}
						/>
						<Controller
							name="hiragana"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									label="Hiragana"
									placeholder="ひらがな"
									variant="outlined"
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
									placeholder="Type then click +"
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
									placeholder="Type then click +"
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
									placeholder="Mneumonic device"
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
