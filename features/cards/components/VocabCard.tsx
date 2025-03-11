import {
	Box,
	CardActionArea,
	CardActions,
	CardContent,
	Icon,
	IconButton,
	Card as MUICard,
	Typography,
} from '@mui/material';
import { Card } from '@prisma/client';
import { FC, MouseEvent, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardUpsertModal from '@/app/components/Modals/CardUpsertModal';

interface VocabCardProps {
	card: Card;
	handleCardClick: (cardId: number) => void;
	selectedCardIds: Set<number>;
	index: number;
}

const VocabCard: FC<VocabCardProps> = ({
	card,
	handleCardClick,
	selectedCardIds,
	index,
}) => {
	const [isCardUpsertModalOpen, setIsCardUpsertModalOpen] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const calcTitleDisplaySize = () => {
		const length = card.japanese.length;
		if (length < 4) {
			return 'h4';
		} else if (length < 9) {
			return 'h5';
		} else {
			return 'h6';
		}
	};

	const handleEdit = (e: MouseEvent) => {
		setIsCardUpsertModalOpen(true);
		setIsEdit(true);
	};

	const handleDelete = (e: MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<MUICard className="relative w-[250px] h-[200px] rounded-xl group ">
			<CardActions className="absolute right-0 z-50 group-hover:opacity-100 opacity-0 transition-opacity flex flex-row">
				<IconButton
					className="group/button"
					size="small"
					onClick={(e: MouseEvent) => handleEdit(e)}
				>
					<EditIcon color="info" className="group-hover/button:[&_path]:fill-warning" />
				</IconButton>
				<IconButton size="small" className="group/button">
					<DeleteIcon
						className="group-hover/button:[&_path]:fill-error transition-all"
						color="info"
						onClick={(e: MouseEvent) => handleDelete(e)}
					/>
				</IconButton>
			</CardActions>
			<CardActionArea
				onClick={() => handleCardClick(card.id)}
				data-active={selectedCardIds.has(card.id) ? '' : undefined}
				className="peer"
				sx={{
					height: '100%',
					'&[data-active]': {
						backgroundColor: 'action.selected',
						'&:hover': {
							backgroundColor: 'action.selectedHover',
						},
					},
				}}
			>
				<Typography
					className="absolute top-2 left-4 text-black/10 dark:text-white/10 "
					variant="h6"
				>
					{index + 1}
				</Typography>
				<CardContent className="flex flex-col justify-center items-center">
					<Typography variant="body2" color="text.secondary">
						{card.hiragana}
					</Typography>
					<Typography variant={calcTitleDisplaySize()} component="div">
						{card.japanese}
					</Typography>
					<Typography variant="body1" color="text.secondary">
						{card.english}
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardUpsertModal
				card={card}
				onClose={() => setIsCardUpsertModalOpen(false)}
				open={isCardUpsertModalOpen}
				isEdit={isEdit}
			/>
		</MUICard>
	);
};

export default VocabCard;
