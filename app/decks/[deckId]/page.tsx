'use client';
import useDebounce from '@/app/customHooks/useDebounce';
import useCardQueries from '@/app/queries/useCardQueries';
import useDeckQueries from '@/app/queries/useDeckQueries';
import CardsTable from '@/features/cards/components/CardsTable';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import AddIcon from '@mui/icons-material/Add';

import {
	Box,
	CircularProgress,
	Fab,
	FormControlLabel,
	IconButton,
	SelectChangeEvent,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import CardSortSelect from '@/features/cards/components/CardSortSelect';
import { CardSortingKeys } from '@/features/cards/types/types';
import VocabCard from '@/features/cards/components/VocabCard';
import CardUpsertModal from '@/app/components/Modals/CardUpsertModal';
import { Card } from '@prisma/client';
import { current } from '@reduxjs/toolkit';

const DeckDetail = () => {
	const params = useParams();
	const { deckId } = params;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const [sortingValue, setSortingValue] = useState<CardSortingKeys>('englishDesc');
	const [isSelectMode, setIsSelectMode] = useState<boolean>(false);
	const [selectedCardIds, setSelectedCardIds] = useState<Set<number>>(new Set());
	const [isCardUpsertModalOpen, setIsCardUpsertModalOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState<boolean>(false);
	const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
	const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
	const [currentCard, setCurrentCard] = useState<Card | null>(null);
	const debouncedSearchTerm = useDebounce(searchTerm, 250);

	const { data: deckData, isPending: isPendingDeck } = useDeckQueries(() => {}, deckId);
	const { dataAll: cardData, isPendingAll: isPendingCard } = useCardQueries(
		() => {},
		deckId
	);

	const handleEdit = (e: MouseEvent) => {
		setIsCardUpsertModalOpen(true);
		setIsEdit(true);
	};

	const handleCardClick = (cardId: number) => {
		if (isSelectMode) {
			const updatedIds = new Set(selectedCardIds);
			if (updatedIds.has(cardId)) {
				updatedIds.delete(cardId);
			} else {
				updatedIds.add(cardId);
			}
			setSelectedCardIds(updatedIds);
		}
	};

	return (
		<Box className="px-6">
			{isPendingCard || isPendingDeck ? (
				<CircularProgress />
			) : (
				<>
					<Tooltip
						className="absolute top-5 right-5"
						title={
							<Stack spacing={1}>
								<Typography variant="body1">
									{`${deckData.isPublic ? 'Public' : 'Private'} Deck`}
								</Typography>
								<Typography variant="body2">
									{`Study Mode: ${deckData.studyMode.name}`}
								</Typography>
								<Typography variant="body2">
									{`Description: ${deckData.description} `}
								</Typography>
							</Stack>
						}
					>
						<HelpIcon color="info" />
					</Tooltip>
					<Box className="flex items-center justify-center ">
						<Typography variant="h1" component="h1">
							{deckData.title}
						</Typography>
					</Box>
					<Box className="flex flex-row gap-4 items-center mb-6 justify-center">
						<TextField
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							variant="filled"
							label="Search"
						/>
						<CardSortSelect
							currentValue={sortingValue}
							handleChange={(e: SelectChangeEvent) =>
								setSortingValue(e.target.value as CardSortingKeys)
							}
						/>
						<FormControlLabel
							control={
								<Switch
									value={isSelectMode}
									onChange={() => setIsSelectMode((val) => !val)}
								/>
							}
							label="Selectable"
						/>

						<Box>
							<IconButton
								className="aspect-square w-fit h-fit"
								onClick={() => setIsGridView((val) => !val)}
							>
								{isGridView ? <TableRowsIcon /> : <GridViewIcon />}
							</IconButton>
						</Box>
					</Box>
					{isGridView ? (
						<Box className="flex flex-wrap items-center justify-center gap-2">
							{cardData.map((card, index) => (
								<VocabCard
									key={card.id}
									index={index}
									card={card}
									handleCardClick={handleCardClick}
									selectedCardIds={selectedCardIds}
									setIsCardUpsertModalOpen={setIsCardUpsertModalOpen}
									setIsEdit={setIsEdit}
									setCurrentCard={setCurrentCard}
								/>
							))}
						</Box>
					) : (
						<CardsTable cardData={cardData} />
					)}
				</>
			)}
			<Fab
				className="fixed right-10 bottom-10"
				color="primary"
				onClick={() => {
					setCurrentCard(null);
					setIsCardUpsertModalOpen(true);
					setIsEdit(false);
				}}
				aria-label="add"
			>
				<AddIcon />
			</Fab>
			<CardUpsertModal
				card={currentCard}
				onClose={() => setIsCardUpsertModalOpen(false)}
				open={isCardUpsertModalOpen}
				isEdit={isEdit}
			/>
		</Box>
	);
};

export default DeckDetail;
