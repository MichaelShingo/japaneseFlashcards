'use client';
import { studyModeTypeMap } from '@/prisma/seedData/studyModes';
import { Box, CircularProgress } from '@mui/material';
import { Card } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { ExtendedDeck, StudyUnit } from './page';
import { containsEnglishChar, isCloseEnough } from '@/features/study/utils/checkAnswer';
import { useForm } from 'react-hook-form';
import TopBar from '@/features/study/components/TopBar';
import CardContent from '@/features/study/components/CardContent';
import BottomMenu from '@/features/study/components/BottomMenu';
import {
	Evaluation,
	EvaluationColors,
	StudyFormData,
} from '@/features/study/constants/types';

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

	const [isAnswered, setIsAnswered] = useState<boolean>(false);
	const [secondsElapsed, setSecondsElapsed] = useState(0);
	const [isCorrect, setIsCorrect] = useState<Evaluation>(null);
	const [correctCount, setCorrectCount] = useState<number>(0);

	const form = useForm<StudyFormData>({
		defaultValues: {
			answer: '',
		},
		mode: 'onChange',
	});

	const { watch, reset, setError } = form;
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
			case 'Enter':
				isAnswered && advanceToNextCard();
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
		} else if (!displayJapanese && containsEnglishChar(watch('answer'))) {
			setError('answer', { message: 'Answer using only Japanese characters.' });
			return;
		}

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
					<TopBar
						correctCount={correctCount}
						studyOrder={studyOrder}
						currentCardIndex={currentCardIndex}
						secondsElapsed={secondsElapsed}
						setSecondsElapsed={setSecondsElapsed}
						isAnswered={isAnswered}
						evaluationColors={EvaluationColors}
						isCorrect={isCorrect}
						currentCard={currentCard}
					/>
					<CardContent
						displayJapanese={displayJapanese}
						currentCard={currentCard}
						isProduction={isProduction}
						form={form}
						isAnswered={isAnswered}
						handleEnterPress={handleEnterPress}
						isCorrect={isCorrect}
						advanceToNextCard={advanceToNextCard}
						submitAnswer={submitAnswer}
						submitSelfRating={submitSelfRating}
					/>
					<BottomMenu
						currentCard={currentCard}
						isAnswered={isAnswered}
						isCorrect={isCorrect}
						answer={answer}
						advanceToNextCard={advanceToNextCard}
						displayJapanese={displayJapanese}
					/>
				</>
			)}
		</Box>
	);
};

export default StudyPresenter;
