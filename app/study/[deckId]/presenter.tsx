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
import { Evaluation, StudyFormData } from '@/features/study/constants/types';
import { calcTimerBonus } from '@/features/study/utils/srsCalculations';

interface StudyPresenterProps {
	studyOrder: StudyUnit[];
	setStudyOrder: Dispatch<SetStateAction<StudyUnit[]>>;
	currentCardIndex: number;
	setCurrentCardIndex: Dispatch<SetStateAction<number>>;
	currentCard: Card;
	deckIsPending: boolean;
	deckData: ExtendedDeck;
	cardIsPending: boolean;
	updateSrsLevel: (difference: number) => void;
	isDisplayJapanese: boolean;
	// submitSelfRating: (rating: number) => void;
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
	updateSrsLevel,
	isDisplayJapanese,

	// submitSelfRating,
}) => {
	const router = useRouter();

	const [isAnswered, setIsAnswered] = useState<boolean>(false);
	const [secondsElapsed, setSecondsElapsed] = useState(0);
	const [isCorrect, setIsCorrect] = useState<Evaluation>(null);
	const [correctCount, setCorrectCount] = useState<number>(0);

	const isProduction =
		!deckIsPending && deckData.studyMode.type === studyModeTypeMap.production;

	const form = useForm<StudyFormData>({
		defaultValues: {
			answer: '',
		},
		mode: 'onChange',
	});

	const { watch, reset, setError } = form;
	const answer = watch('answer');

	const advanceToNextCard = (selfRating?: number) => {
		if (isCorrect || selfRating === 1) {
			setCorrectCount((value) => value + 1);
		} else {
			setStudyOrder([...studyOrder, studyOrder[currentCardIndex]]);
		}

		if (currentCardIndex >= studyOrder.length - 1) {
			router.push('/decks');
			return;
		}

		if (isProduction) {
			setIsCorrect(null);
			reset();
			setIsAnswered(false);
		}
		setCurrentCardIndex((value) => value + 1);
		setSecondsElapsed(0);

		if (isCorrect || selfRating === 1) {
			updateSrsLevel(1 + calcTimerBonus(secondsElapsed));
		} else {
			updateSrsLevel(-1);
		}
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

	const submitAnswer = (): void => {
		if (answer === '') {
			setError('answer', { message: 'Please enter an answer.' });
			return;
		} else if (!isDisplayJapanese && containsEnglishChar(watch('answer'))) {
			setError('answer', { message: 'Answer using only Japanese characters.' });
			return;
		}

		setIsAnswered(true);
		const formattedAnswer = answer.toLowerCase().trim();

		if (isDisplayJapanese) {
			const lowerCaseEnglish = currentCard.english.toLowerCase();

			if (formattedAnswer === lowerCaseEnglish) {
				setIsCorrect('correct');
				// updateSrsLevel(1 + calcTimerBonus(secondsElapsed));
				return;
			}

			for (let synonym of currentCard.englishSynonyms) {
				if (synonym.toLowerCase() === answer) {
					setIsCorrect('correct');
					// updateSrsLevel(1 + calcTimerBonus(secondsElapsed));
					return;
				}
			}

			if (isCloseEnough(formattedAnswer, lowerCaseEnglish, 4)) {
				setIsCorrect('close');
				// updateSrsLevel(1 + calcTimerBonus(secondsElapsed));
				return;
			}

			for (let synonym of currentCard.englishSynonyms) {
				if (isCloseEnough(synonym.toLowerCase(), answer, 4)) {
					setIsCorrect('close');
					// updateSrsLevel(1 + calcTimerBonus(secondsElapsed));

					return;
				}
			}
		} else {
			if (answer === currentCard.japanese || answer === currentCard.hiragana) {
				setIsCorrect('correct');
				// updateSrsLevel(1 + calcTimerBonus(secondsElapsed));

				return;
			}
			for (let synonym of currentCard.japaneseSynonyms) {
				if (synonym === answer) {
					setIsCorrect('correct');
					// updateSrsLevel(1 + calcTimerBonus(secondsElapsed));

					return;
				}
			}
		}
		setIsCorrect('incorrect');
		// updateSrsLevel(-1);

		return;
	};

	const submitSelfRating = (rating: number) => {
		advanceToNextCard(rating);
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
						isCorrect={isCorrect}
						currentCard={currentCard}
						isDisplayJapanese={isDisplayJapanese}
					/>
					<CardContent
						isDisplayJapanese={isDisplayJapanese}
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
						isDisplayJapanese={isDisplayJapanese}
						isProduction={isProduction}
					/>
				</>
			)}
		</Box>
	);
};

export default StudyPresenter;
