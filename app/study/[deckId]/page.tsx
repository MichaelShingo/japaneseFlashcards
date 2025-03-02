'use client';
import { studyModeIdentifiers } from '@/prisma/seedData/studyModes';
import { Card, Deck, StudyMode } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import StudyPresenter from './presenter';
import { shuffleArray } from '@/features/study/utils/shuffle';

export type StudyUnit = {
	cardId: number;
	studyType: 'displayEnglish' | 'displayJapanese';
	reviewIncorrect: boolean;
};

export interface ExtendedDeck extends Deck {
	studyMode: StudyMode;
}

const Study = () => {
	const params = useParams();
	const { deckId } = params;

	const [studyOrder, setStudyOrder] = useState<StudyUnit[]>([
		{ cardId: -1, studyType: 'displayEnglish', reviewIncorrect: false },
	]);
	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
	const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

	const { data: cardData, isPending: cardIsPending } = useQuery<Card[]>({
		queryKey: ['cards'],
		queryFn: async () => {
			const queryParams = queryString.stringify({ dueForStudy: true, deckId: deckId });
			const response = await fetch(`/api/cards/?${queryParams}`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}
			return await response.json();
		},
	});

	const { data: deckData, isPending: deckIsPending } = useQuery<ExtendedDeck>({
		queryKey: ['deck'],
		queryFn: async () => {
			const response = await fetch(`/api/decks/${deckId}`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Failed to fetch.');
			}
			return response.json();
		},
	});

	useEffect(() => {
		if (!isFirstLoad || !cardData || !deckData) {
			return;
		}

		const displayJapanese = [
			studyModeIdentifiers.japaneseRecognition,
			studyModeIdentifiers.produceEnglish,
			studyModeIdentifiers.produceJapaneseAndEnglish,
			studyModeIdentifiers.japaneseAndEnglishRecognition,
		].includes(deckData.studyMode.identifier);

		const displayEnglish = [
			studyModeIdentifiers.englishRecognition,
			studyModeIdentifiers.produceJapanese,
			studyModeIdentifiers.produceJapaneseAndEnglish,
			studyModeIdentifiers.japaneseAndEnglishRecognition,
		].includes(deckData.studyMode.identifier);

		const order: StudyUnit[] = [];

		for (let card of cardData) {
			if (displayJapanese) {
				order.push({
					cardId: card.id,
					studyType: 'displayJapanese',
					reviewIncorrect: false,
				});
			}
			if (displayEnglish) {
				order.push({
					cardId: card.id,
					studyType: 'displayEnglish',
					reviewIncorrect: false,
				});
			}
		}

		setStudyOrder(shuffleArray(order));
		setIsFirstLoad(false);
	}, [cardData, deckData, isFirstLoad]);

	const currentCard =
		cardData &&
		!cardIsPending &&
		cardData?.find((card) => card.id === studyOrder[currentCardIndex].cardId);

	const submitSelfRating = (rating: number) => {
		console.log(rating);
	};

	return (
		<StudyPresenter
			studyOrder={studyOrder}
			setStudyOrder={setStudyOrder}
			currentCardIndex={currentCardIndex}
			setCurrentCardIndex={setCurrentCardIndex}
			currentCard={currentCard}
			deckIsPending={deckIsPending}
			deckData={deckData}
			cardIsPending={cardIsPending}
			submitSelfRating={submitSelfRating}
		/>
	);
};

export default Study;
