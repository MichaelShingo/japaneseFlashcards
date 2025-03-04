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
import { Evaluation, StudyFormData } from '../constants/types';
import { EvaluationColors, EvaluationMessages } from '../constants/maps';
import HiraganaPath from './HiraganaPath';
import KatakanaPath from './KatakanaPath';

interface CardContentProps {
	isDisplayJapanese: boolean;
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
	isDisplayJapanese,
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
			{isProduction && (
				<Typography
					className="min-h-[75px] uppercase"
					variant="h2"
					color={EvaluationColors[isCorrect]}
				>
					{EvaluationMessages[isCorrect]}
				</Typography>
			)}
			<Typography variant="h1">
				{isDisplayJapanese ? currentCard.japanese : currentCard.english}
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
									} else if (isDisplayJapanese && containsJapaneseChar(value)) {
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
									isDisplayJapanese ? 'Type in English' : '日本語を入力してください'
								}
								onChange={(e) =>
									field.onChange(
										isDisplayJapanese
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
													isDisplayJapanese ? 'hidden' : 'visible',
													'absolute right-4',
												])}
												position="end"
											>
												<IconButton
													onClick={() => setKatakataInput((val) => !val)}
													disabled={isDisplayJapanese}
													edge="end"
												>
													<SvgIcon className="text-lg" viewBox="0 0 300 300" color="info">
														{katakanaInput ? <HiraganaPath /> : <KatakanaPath />}
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
