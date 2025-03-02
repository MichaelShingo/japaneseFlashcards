'use client';
import { Box, Button, ButtonGroup, TextField, Typography } from '@mui/material';
import { Card } from '@prisma/client';
import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { twMerge } from 'tailwind-merge';
import ErrorIcon from '@mui/icons-material/Error';
import {
	containsJapaneseChar,
	containsSymbols,
} from '@/features/study/utils/checkAnswer';
import { Controller, UseFormReturn } from 'react-hook-form';
import { customToKana } from '@/app/utils/kana';
import {
	Evaluation,
	EvaluationColors,
	EvaluationMessages,
	StudyFormData,
} from '../constants/types';

interface CardContentProps {
	displayJapanese: boolean;
	currentCard: Card;
	isProduction: boolean;
	form: UseFormReturn<StudyFormData, any, undefined>;
	isAnswered: boolean;
	handleEnterPress: (e: React.KeyboardEvent) => void;
	isCorrect: Evaluation;
	advanceToNextCard: () => void;
	submitAnswer: () => void;
	submitSelfRating: (rating: number) => void;
}

const CardContent: FC<CardContentProps> = ({
	displayJapanese,
	currentCard,
	isProduction,
	form,
	isAnswered,
	handleEnterPress,
	isCorrect,
	advanceToNextCard,
	submitAnswer,
	submitSelfRating,
}) => {
	const {
		watch,
		formState: { errors },
		control,
	} = form;

	return (
		<>
			<Typography
				className="min-h-[75px] uppercase"
				variant="h2"
				color={EvaluationColors[isCorrect]}
			>
				{EvaluationMessages[isCorrect]}
			</Typography>
			<Typography variant="h1">
				{displayJapanese ? currentCard.japanese : currentCard.english}
			</Typography>

			{isProduction ? (
				<>
					<Controller
						name="answer"
						control={control}
						rules={{
							validate: {
								checkCharType: (value) => {
									if (containsSymbols(value)) {
										return 'Invalid characters found.';
									} else if (value === '') {
										return 'Please enter an answer.';
									} else if (displayJapanese && containsJapaneseChar(value)) {
										return 'Answer using only English characters.';
									}
								},
							},
						}}
						render={({ field }) => (
							<TextField
								{...field}
								className={twMerge([
									'w-[50vw] min-w-[300px] max-w-[350px] [&_.MuiInputBase-input]:text-center',
								])}
								disabled={isAnswered}
								variant="outlined"
								autoFocus
								focused
								placeholder={
									displayJapanese ? 'Type in English' : '日本語を入力してください'
								}
								onChange={(e) =>
									field.onChange(
										displayJapanese ? e.target.value : customToKana(e.target.value)
									)
								}
								onKeyDown={(e: React.KeyboardEvent) => handleEnterPress(e)}
								inputRef={(input) => input && input.focus()}
							/>
						)}
					/>
					<Button
						type="submit"
						disabled={watch('answer') === ''}
						variant={isAnswered ? 'outlined' : 'contained'}
						color={EvaluationColors[isCorrect]}
						size="large"
						onClick={isAnswered ? advanceToNextCard : submitAnswer}
					>
						{isAnswered ? 'Next Card' : 'Submit Answer'}
					</Button>
					<Box className="min-h-[25px]">
						{errors?.answer?.message && (
							<Typography
								className="flex flex-row items-center gap-2"
								color="error"
								variant="body1"
							>
								<ErrorIcon />
								{errors?.answer?.message}
							</Typography>
						)}
					</Box>
				</>
			) : (
				<ButtonGroup variant="contained" aria-label="Basic button group">
					<Button
						color="secondary"
						startIcon={<CloseIcon />}
						className="min-w-[175px]"
						size="large"
						onClick={() => submitSelfRating(0)}
					>
						Incorrect
					</Button>
					<Button
						startIcon={<CheckIcon />}
						className="min-w-[175px]"
						size="large"
						onClick={() => submitSelfRating(1)}
					>
						Correct
					</Button>
				</ButtonGroup>
			)}
		</>
	);
};

export default CardContent;
