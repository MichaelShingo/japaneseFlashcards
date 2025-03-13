import { FC, memo, useState } from 'react';
import { Card } from '@prisma/client';
import CardsTable from '@/features/cards/components/CardsTable';
import useDebounce from '@/app/customHooks/useDebounce';
import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, Typography } from '@mui/material';
import VocabCard from '@/features/cards/components/VocabCard';
import CardUpsertModal from '@/app/components/Modals/CardUpsertModal';
import ConfirmModal from '@/app/components/Modals/ConfirmModal';
import { useParams } from 'next/navigation';
import { useCardMutations } from '@/app/queries/useCardQueries';
import CardDetailModal from '@/app/components/Modals/CardDetailModal';
import queryString from 'query-string';
import { useCardQuery } from '@/app/queries/useCardQueries';
import { useQuery } from '@tanstack/react-query';
interface CardDisplayProps {
	isGridView: boolean;
	isSelectMode: boolean;
	debouncedSearchTerm: string;
}

const CardDisplay: FC<CardDisplayProps> = ({
	isGridView,
	isSelectMode,
	debouncedSearchTerm,
}) => {
	const params = useParams();
	const { deckId } = params;

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
	const [currentCard, setCurrentCard] = useState<Card | null>(null);
	const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState<boolean>(false);
	const [isCardUpsertModalOpen, setIsCardUpsertModalOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [selectedCardIds, setSelectedCardIds] = useState<Set<number>>(new Set());

	const queryParams = queryString.stringify({
		deckId: deckId,
		searchTerm: 'a',
	});

	const { data: cardData, isPending: isPendingCard } = useQuery<Card[]>({
		queryKey: ['cards', queryParams],
		queryFn: async () => {
			const response = await fetch(`/api/cards/all/?${queryParams}`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}
			return await response.json();
		},
	});

	const { mutateDelete, isPendingDelete } = useCardMutations();

	const handleCardClick = (cardId: number) => {
		if (isSelectMode) {
			const updatedIds = new Set(selectedCardIds);
			if (updatedIds.has(cardId)) {
				updatedIds.delete(cardId);
			} else {
				updatedIds.add(cardId);
			}
			setSelectedCardIds(updatedIds);
		} else {
			setIsCardDetailModalOpen(true);
			setCurrentCard(cardData.find((card) => card.id === cardId));
		}
	};
	return (
		<>
			{!isPendingCard && (
				<>
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
									setIsDeleteModalOpen={setIsDeleteModalOpen}
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
			<CardDetailModal
				open={isCardDetailModalOpen}
				onClose={() => setIsCardDetailModalOpen(false)}
				card={currentCard}
			/>
			<CardUpsertModal
				card={currentCard}
				deckId={deckId as string}
				onClose={() => setIsCardUpsertModalOpen(false)}
				open={isCardUpsertModalOpen}
				isEdit={isEdit}
			/>
			<ConfirmModal
				title="Confirm Card Deletion"
				open={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				confirmAction={() => mutateDelete(currentCard.id)}
				isLoading={isPendingDelete}
			>
				<Typography variant="body1">
					Are you sure you want to delete this card? This action is permanent and cannot
					be undone. Your study progress on this card will be deleted as well.
				</Typography>
				<Typography variant="subtitle1" className="mt-5 mb-2 text-accent">
					Card to be Deleted: {currentCard?.japanese}
				</Typography>
			</ConfirmModal>
		</>
	);
};

export default memo(CardDisplay);
