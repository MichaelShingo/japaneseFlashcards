'use client';
import { Card, Deck, StudyMode } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudyPresenter from './presenter';
import { shuffleArray } from '@/features/study/utils/shuffle';
import useStudyCardQueries from '@/app/queries/useCardQueries';
import useDeckQueries from '@/app/queries/useDeckQueries';
import {
	calcNewSrsLevel,
	calcNextStudyDate,
} from '@/features/study/utils/srsCalculations';
import {
	isDeckDisplayEnglish,
	isDeckDisplayJapanese,
} from '@/app/utils/studyModeFunctions';
import queryString from 'query-string';

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

	const { data: dataDeck, isPending: isPendingDeck } = useDeckQueries(() => {}, deckId);
	const [cardData, setCardData] = useState<Card[]>(null);
	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

	const { mutatePatch: mutatePatchCard } = useStudyCardQueries(() => {}, deckId);

	const [studyOrder, setStudyOrder] = useState<StudyUnit[]>([
		{ cardId: -1, studyType: 'displayEnglish', reviewIncorrect: false },
	]);
	const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

	const fetchCards = async () => {
		const queryParams = queryString.stringify({
			dueForStudy: true,
			deckId: deckId,
		});
		const response = await fetch(`/api/cards/?${queryParams}`);
		const data = await response.json();
		setCardData(data);
	};

	useEffect(() => {
		fetchCards();
	}, []);

	useEffect(() => {
		if (!dataDeck || !cardData || !isFirstLoad) return;
		const order: StudyUnit[] = [];

		for (let card of cardData) {
			if (isDeckDisplayJapanese(dataDeck.studyMode.identifier)) {
				order.push({
					cardId: card.id,
					studyType: 'displayJapanese',
					reviewIncorrect: false,
				});
			}
			if (isDeckDisplayEnglish(dataDeck.studyMode.identifier)) {
				order.push({
					cardId: card.id,
					studyType: 'displayEnglish',
					reviewIncorrect: false,
				});
			}
		}

		setIsFirstLoad(false);

		setStudyOrder(shuffleArray(order));
	}, [dataDeck, cardData]);

	const currentCard =
		cardData && cardData.find((card) => card.id === studyOrder[currentCardIndex].cardId);
	const isDisplayJapanese = studyOrder[currentCardIndex].studyType === 'displayJapanese';

	const updateSrsLevel = (difference: number): void => {
		const isReviewIncorrect = studyOrder[currentCardIndex].reviewIncorrect;

		if (!isReviewIncorrect) {
			const updatedCard = { ...currentCard };
			if (isDisplayJapanese) {
				const newSrsLevel = calcNewSrsLevel(
					updatedCard.displayJapaneseSrsLevel,
					difference
				);
				const nextStudyDate = calcNextStudyDate(updatedCard.displayJapaneseSrsLevel);
				updatedCard.displayJapaneseSrsLevel = newSrsLevel;
				updatedCard.displayJapaneseNextStudy = nextStudyDate;

				const updatedCardData = cardData.map((card) =>
					card.id === updatedCard.id ? updatedCard : card
				);
				setCardData(updatedCardData);

				mutatePatchCard({
					...updatedCard,
					displayJapaneseSrsLevel: newSrsLevel,
					displayJapaneseNextStudy: nextStudyDate,
				});
			} else {
				const newSrsLevel = calcNewSrsLevel(
					updatedCard.displayEnglishSrsLevel,
					difference
				);
				const nextStudyDate = calcNextStudyDate(updatedCard.displayEnglishSrsLevel);
				updatedCard.displayEnglishSrsLevel = newSrsLevel;
				updatedCard.displayEnglishNextStudy = nextStudyDate;

				const updatedCardData = cardData.map((card) =>
					card.id === updatedCard.id ? updatedCard : card
				);
				setCardData(updatedCardData);

				mutatePatchCard({
					...updatedCard,
					displayEnglishSrsLevel: newSrsLevel,
					displayEnglishNextStudy: nextStudyDate,
				});
			}
		}
	};

	return (
		<StudyPresenter
			updateSrsLevel={updateSrsLevel}
			studyOrder={studyOrder}
			setStudyOrder={setStudyOrder}
			currentCardIndex={currentCardIndex}
			setCurrentCardIndex={setCurrentCardIndex}
			currentCard={currentCard}
			deckIsPending={isPendingDeck}
			deckData={dataDeck}
			cardIsPending={false}
			isDisplayJapanese={isDisplayJapanese}
			// submitSelfRating={submitSelfRating}
		/>
	);
};

export default Study;
