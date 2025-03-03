'use client';
import { studyModeIdentifiers } from '@/prisma/seedData/studyModes';
import { Deck, StudyMode } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudyPresenter from './presenter';
import { shuffleArray } from '@/features/study/utils/shuffle';
import useCardQueries from '@/app/queries/useCardQueries';
import useDeckQueries from '@/app/queries/useDeckQueries';

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
	const { data: dataCard, isPending: isPendingCard } = useCardQueries(null, deckId);
	const { data: dataDeck, isPending: isPendingDeck } = useDeckQueries(null, deckId);

	const [studyOrder, setStudyOrder] = useState<StudyUnit[]>([
		{ cardId: -1, studyType: 'displayEnglish', reviewIncorrect: false },
	]);
	const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
	const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);

	useEffect(() => {
		if (!isFirstLoad || !dataCard || !dataDeck) {
			return;
		}

		const displayJapanese = [
			studyModeIdentifiers.japaneseRecognition,
			studyModeIdentifiers.produceEnglish,
			studyModeIdentifiers.produceJapaneseAndEnglish,
			studyModeIdentifiers.japaneseAndEnglishRecognition,
		].includes(dataDeck.studyMode.identifier);

		const displayEnglish = [
			studyModeIdentifiers.englishRecognition,
			studyModeIdentifiers.produceJapanese,
			studyModeIdentifiers.produceJapaneseAndEnglish,
			studyModeIdentifiers.japaneseAndEnglishRecognition,
		].includes(dataDeck.studyMode.identifier);

		const order: StudyUnit[] = [];

		for (let card of dataCard) {
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
	}, [dataCard, dataDeck, isFirstLoad]);

	const currentCard =
		dataCard &&
		!isPendingCard &&
		dataCard?.find((card) => card.id === studyOrder[currentCardIndex].cardId);

	return (
		<StudyPresenter
			studyOrder={studyOrder}
			setStudyOrder={setStudyOrder}
			currentCardIndex={currentCardIndex}
			setCurrentCardIndex={setCurrentCardIndex}
			currentCard={currentCard}
			deckIsPending={isPendingDeck}
			deckData={dataDeck}
			cardIsPending={isPendingCard}
			// submitSelfRating={submitSelfRating}
		/>
	);
};

export default Study;
