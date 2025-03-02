'use client';
import {
	Box,
	Button,
	ButtonGroup,
	IconButton,
	InputAdornment,
	SvgIcon,
	TextField,
	Typography,
} from '@mui/material';
import { Card } from '@prisma/client';
import { FC, useState } from 'react';
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
	const [katakanaInput, setKatakataInput] = useState<boolean>(false);

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
										displayJapanese
											? e.target.value
											: customToKana(e.target.value, katakanaInput)
									)
								}
								onKeyDown={(e: React.KeyboardEvent) => handleEnterPress(e)}
								inputRef={(input) => input && input.focus()}
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment
												className={twMerge([
													displayJapanese ? 'hidden' : 'visible',
													'absolute right-4',
												])}
												position="end"
											>
												<IconButton
													onClick={() => setKatakataInput((val) => !val)}
													disabled={displayJapanese}
													edge="end"
												>
													<SvgIcon className="text-lg" viewBox="0 0 300 300" color="info">
														{katakanaInput ? (
															<path d="M211.41,106.03c-1,4.32-1.99,8.64-3.32,12.62,58.45,10.3,80.04,46.83,80.04,86.02,0,52.81-45.17,84.69-128.2,93.99-1.33-4.65-5.98-14.61-8.97-19.93,68.75-6.64,112.92-30.55,112.92-73.4v-2.33c-1.66-38.53-27.57-57.46-63.1-63.44-14.28,37.53-38.53,72.4-66.09,97.64,2.32,6.97,5.31,12.95,8.64,17.93l-19.6,12.29c-2.99-4.65-5.65-10.3-7.97-16.61-26.57,19.6-47.83,24.91-62.77,24.91-26.57,0-40.19-19.6-40.19-44.17,0-45.83,37.86-82.37,86.02-101.63-.66-17.27-.66-36.2-.33-55.8-56.13,0-62.11,0-73.07-.66l-.66-21.92c16.94,1,45.83,1,74.4,1,.33-15.28,1-33.88,1.66-49.49l33.21,2.32c-.33,3.32-3.65,5.98-8.64,6.64-1,12.29-1.66,27.57-2.66,39.85,36.2-1,99.64-5.31,133.18-13.95l2.99,22.58c-35.21,8.63-99.31,11.96-137.17,12.95-.66,17.27-1,33.88-.66,49.49,23.25-7.31,44.17-7.64,49.82-7.64,4.98,0,9.3,0,13.62.33,1.33-5.31,2.32-10.3,3.32-15.61l23.58,5.98ZM109.45,229.91c-5.31-20.59-8.3-46.83-9.63-77.72-36.2,15.94-64.43,43.51-64.43,75.72,0,19.6,10.96,26.24,22.92,25.57,15.61-.33,33.54-9.3,51.15-23.58ZM177.53,136.59c-5.31-.33-31.22-1-56.13,7.97.66,26.9,2.99,49.82,7.64,68.42,19.93-20.26,37.86-47.16,48.49-76.39Z" />
														) : (
															<path d="M289.14,36.62c-.66,1.33-2.66,2.32-4.32,2.99-17.93,42.51-46.5,79.38-78.71,106.28-4.98-4.32-14.28-10.3-20.26-13.62,30.56-22.25,55.13-54.47,66.09-82.37H14.14v-22.58h250.42l3.65-1.66,20.92,10.96ZM159.61,97.06c-.33,2.66-3.32,4.98-7.64,5.65-9.63,78.38-36.53,153.11-104.95,192.63-4.65-3.99-13.29-11.62-19.6-15.28,67.75-37.2,92-106.61,99.97-186.65l32.22,3.65Z" />
														)}
													</SvgIcon>
												</IconButton>
											</InputAdornment>
										),
									},
								}}
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
