'use client';
import { Deck, StudyMode } from '@prisma/client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import StudyPresenter from './presenter';
import { shuffleArray } from '@/features/study/utils/shuffle';
import useCardQueries from '@/app/queries/useCardQueries';
import useDeckQueries from '@/app/queries/useDeckQueries';
import { calcNextStudyDate } from '@/features/study/utils/srsCalculations';
import {
	isDeckDisplayEnglish,
	isDeckDisplayJapanese,
} from '@/app/utils/studyModeFunctions';

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
	const {
		data: dataCard,
		isPending: isPendingCard,
		mutatePatch: mutatePatchCard,
	} = useCardQueries(null, deckId);
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

		const order: StudyUnit[] = [];

		for (let card of dataCard) {
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

		setStudyOrder(shuffleArray(order));
		setIsFirstLoad(false);
	}, [dataCard, dataDeck, isFirstLoad]);

	const currentCard =
		dataCard &&
		!isPendingCard &&
		dataCard?.find((card) => card.id === studyOrder[currentCardIndex].cardId);

	console.log('🚀 ~ Study ~ currentCard:', currentCard);
	const isDisplayJapanese = studyOrder[currentCardIndex].studyType === 'displayJapanese';
	console.log('🚀 ~ Study ~ dataCard:', dataCard);

	const updateSrsLevel = (difference: number): void => {
		console.log('🚀 ~ updateSrsLevel ~ difference:', difference);
		const isReviewIncorrect = studyOrder[currentCardIndex].reviewIncorrect;

		if (!isReviewIncorrect) {
			if (isDisplayJapanese) {
				mutatePatchCard({
					...currentCard,
					displayJapaneseSrsLevel: currentCard.displayJapaneseSrsLevel + difference,
					displayJapaneseNextStudy: calcNextStudyDate(
						currentCard.displayJapaneseSrsLevel
					),
				});
			} else {
				mutatePatchCard({
					...currentCard,
					displayEnglishSrsLevel: currentCard.displayEnglishSrsLevel + difference,
					displayEnglishNextStudy: calcNextStudyDate(currentCard.displayEnglishSrsLevel),
				});
			}
		}
	};
	console.log('🚀 ~ Study ~ isPendingCard:', isPendingCard);
	console.log('🚀 ~ Study ~ isPendingDeck:', isPendingDeck);

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
			cardIsPending={isPendingCard}
			isDisplayJapanese={isDisplayJapanese}
			// submitSelfRating={submitSelfRating}
		/>
	);
};

export default Study;
