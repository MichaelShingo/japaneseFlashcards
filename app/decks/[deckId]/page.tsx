'use client';
import useDeckQueries from '@/app/queries/useDeckQueries';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { CardSortingKeys } from '@/features/cards/types/types';

import CardsHeader from '@/features/cards/components/CardsHeader';
import CardDisplay from '@/features/cards/components/CardDisplay';
import useDebounce from '@/app/customHooks/useDebounce';

const DeckDetail = () => {
	const params = useParams();
	const { deckId } = params;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const [sortingValue, setSortingValue] = useState<CardSortingKeys>('englishDesc');
	const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
	const debouncedSearchTerm = useDebounce(searchTerm, 250);

	const { data: deckData, isPending: isPendingDeck } = useDeckQueries(() => {}, deckId);

	return (
		<Box className="px-6">
			<CardsHeader
				deckData={deckData}
				isPendingDeck={isPendingDeck}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				sortingValue={sortingValue}
				setSortingValue={setSortingValue}
				isSelectMode={isSelectMode}
				setIsSelectMode={setIsSelectMode}
				isGridView={isGridView}
				setIsGridView={setIsGridView}
			/>
			<CardDisplay
				isGridView={isGridView}
				isSelectMode={isSelectMode}
				debouncedSearchTerm={debouncedSearchTerm}
			/>
		</Box>
	);
};

export default DeckDetail;
