'use client';
import { studyModeTypeMap } from '@/prisma/seedData/studyModes';
import { toKana } from 'wanakana';
import {
	Box,
	Button,
	ButtonGroup,
	CircularProgress,
	TextField,
	Typography,
} from '@mui/material';
import { Card } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import CardUpsertModal from '@/app/components/Modals/CardUpsertModal';
import { twMerge } from 'tailwind-merge';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Timer from '@/features/study/components/Timer';
import { ExtendedDeck, StudyUnit } from './page';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import ErrorIcon from '@mui/icons-material/Error';
import {
	containsEnglishChar,
	containsJapaneseChar,
	containsSymbols,
	isCloseEnough,
} from '@/app/utils/checkAnswer';
import { Controller, useForm } from 'react-hook-form';
import AnswerModal from '@/features/study/components/AnswerModal';

interface StudyPresenterProps {
	studyOrder: StudyUnit[];
	setStudyOrder: Dispatch<SetStateAction<StudyUnit[]>>;
	currentCardIndex: number;
	setCurrentCardIndex: Dispatch<SetStateAction<number>>;
	currentCard: Card;
	deckIsPending: boolean;
	deckData: ExtendedDeck;
	cardIsPending: boolean;
	submitSelfRating: (rating: number) => void;
}

type StudyFormData = {
	answer: string;
};

type Evaluation = 'correct' | 'incorrect' | 'close' | null;

const evaluationMessages: Record<Evaluation, string> = {
	correct: 'Correct!',
	close: 'Very close!',
	incorrect: 'Incorrect',
};
const evaluationColors: Record<Evaluation, 'success' | 'warning' | 'error'> = {
	correct: 'success',
	close: 'warning',
	incorrect: 'error',
};

const StudyPresenter: FC<StudyPresenterProps> = ({
	studyOrder,
	setStudyOrder,
	currentCardIndex,
	setCurrentCardIndex,
	currentCard,
	deckIsPending,
	deckData,
	cardIsPending,
	submitSelfRating,
}) => {
	const router = useRouter();
	const [isUpsertModalOpen, setIsUpsertModalOpen] = useState<boolean>(false);
	const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
	const [isAnswered, setIsAnswered] = useState<boolean>(false);
	const [secondsElapsed, setSecondsElapsed] = useState(0);
	const [isCorrect, setIsCorrect] = useState<Evaluation>(null);
	const [answerError, setAnswerError] = useState<string | null>(null);
	const [correctCount, setCorrectCount] = useState<number>(0);

	const {
		control,
		watch,
		setValue,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
	} = useForm<StudyFormData>({
		defaultValues: {
			answer: '',
		},
		mode: 'onChange',
	});

	const answer = watch('answer');

	const advanceToNextCard = () => {
		if (isCorrect) {
			setCorrectCount((value) => value + 1);
		} else {
			setStudyOrder([...studyOrder, studyOrder[currentCardIndex]]);
		}
		if (currentCardIndex >= studyOrder.length - 1) {
			router.push('/decks');
			return;
		}
		setCurrentCardIndex((value) => value + 1);
		setIsCorrect(null);
		reset();
		setIsAnswered(false);
		setSecondsElapsed(0);
	};

	const handleKeyPress = (e: KeyboardEvent) => {
		if (
			(e.target as HTMLElement).tagName === 'INPUT' ||
			(e.target as HTMLElement).tagName === 'TEXTAREA'
		) {
			return;
		}

		switch (e.key) {
			case 'm':
				break;
			case 'a':
				setIsAnswerModalOpen(true);
				break;
			case 'e':
				setIsUpsertModalOpen(true);
				break;
			case 'Enter':
				isAnswered && advanceToNextCard();
				break;
			case 'Esc':
				setIsAnswerModalOpen(false);
				setIsUpsertModalOpen(false);
				break;
		}
	};

	const handleEnterPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			isAnswered ? advanceToNextCard() : submitAnswer();
			return;
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [isAnswered, isCorrect, answer]);

	const isProduction =
		!deckIsPending && deckData.studyMode.type === studyModeTypeMap.production;

	const displayJapanese = studyOrder[currentCardIndex].studyType === 'displayJapanese';

	const submitAnswer = (): void => {
		if (answer === '') {
			setError('answer', { message: 'Please enter an answer.' });
			return;
		}
		if (!displayJapanese && containsEnglishChar(watch('answer'))) {
			setError('answer', { message: 'Answer using only Japanese characters.' });
			return;
		}
		setAnswerError(null);
		setIsAnswered(true);
		const formattedAnswer = answer.toLowerCase().trim();

		if (displayJapanese) {
			const lowerCaseEnglish = currentCard.english.toLowerCase();

			if (formattedAnswer === lowerCaseEnglish) {
				setIsCorrect('correct');
				return;
			}

			for (let synonym of currentCard.englishSynonyms) {
				if (synonym.toLowerCase() === answer) {
					setIsCorrect('correct');
					return;
				}
			}

			if (isCloseEnough(formattedAnswer, lowerCaseEnglish, 4)) {
				setIsCorrect('close');
				return;
			}

			for (let synonym of currentCard.englishSynonyms) {
				if (isCloseEnough(synonym.toLowerCase(), answer, 4)) {
					setIsCorrect('close');
					return;
				}
			}
		} else {
			if (answer === currentCard.japanese || answer === currentCard.hiragana) {
				setIsCorrect('correct');
				return;
			}
			for (let synonym of currentCard.japaneseSynonyms) {
				if (synonym === answer) {
					setIsCorrect('correct');
					return;
				}
			}
		}
		setIsCorrect('incorrect');
		return;
	};

	return (
		<Box className="flex items-center flex-col gap-6 justify-center w-full h-[95vh] overflow-hidden">
			{!currentCard || cardIsPending || deckIsPending ? (
				<CircularProgress />
			) : (
				<>
					{/* <ResultPopover isCorrect={isCorrect} visible={isPopoverVisible} setVisible={setIsPopoverVisible} /> */}
					<Box className="left-0 top-0 h-2 absolute bg-ui-02 w-[100vw]">
						<Box
							className="bg-accent h-full transition-all duration-500"
							sx={{ width: `${(correctCount / studyOrder?.length) * 100}%` }}
						/>
					</Box>
					<Box className="absolute top-3 left-2">
						<Button
							startIcon={<CloseIcon className="aspect-square h-[28px] w-[28px]" />}
							size="small"
							color="info"
							onClick={() => router.push('/decks')}
						>
							Exit Study Mode
						</Button>
					</Box>
					<Box className="absolute top-3 right-3">
						<Box className="flex flex-row">
							<Button disabled>
								Progress: {`${currentCardIndex}/${studyOrder.length}`} (
								{Math.round((correctCount / studyOrder?.length) * 100)}%)
							</Button>
							<Timer
								secondsElapsed={secondsElapsed}
								setSecondsElapsed={setSecondsElapsed}
								isAnswered={isAnswered}
							/>
							<Button
								color={isAnswered ? evaluationColors[isCorrect] : 'info'}
								startIcon={
									isAnswered ? (
										isCorrect ? (
											<KeyboardDoubleArrowUpIcon />
										) : (
											<KeyboardDoubleArrowDownIcon />
										)
									) : (
										<LeaderboardIcon className="" />
									)
								}
								size="small"
							>
								Level: {currentCard.srsLevel}
							</Button>
						</Box>
					</Box>

					<Typography
						className="min-h-[75px] uppercase"
						variant="h2"
						color={evaluationColors[isCorrect]}
					>
						{evaluationMessages[isCorrect]}
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
													: toKana(e.target.value, {
															customKanaMapping: { nn: 'ん', n: 'n' },
														})
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
								color={evaluationColors[isCorrect]}
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
					<Box className="absolute bottom-10 flex flex-row gap-10">
						<Button
							disabled={!currentCard.hint}
							variant="outlined"
							startIcon={<QuestionMarkIcon />}
						>
							Show Mnemonic
						</Button>
						<Button
							onClick={() => setIsAnswerModalOpen(true)}
							variant="outlined"
							disabled={!isAnswered}
							startIcon={<VisibilityIcon />}
						>
							Show Answer
						</Button>
						<Button
							variant="outlined"
							disabled={!isAnswered}
							onClick={() => setIsUpsertModalOpen(true)}
							startIcon={<EditIcon />}
						>
							Edit Card
						</Button>
					</Box>
					<AnswerModal
						open={isAnswerModalOpen}
						onClose={() => setIsAnswerModalOpen(false)}
						card={currentCard}
						displayJapanese={displayJapanese}
					/>
					<CardUpsertModal
						open={isUpsertModalOpen}
						card={currentCard}
						onClose={() => setIsUpsertModalOpen(false)}
						isEdit
					/>
				</>
			)}
		</Box>
	);
};

export default StudyPresenter;
