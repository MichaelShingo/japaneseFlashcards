'use client';
import { Box, Button } from '@mui/material';
import { Card } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CardUpsertModal from '@/app/components/Modals/CardUpsertModal';
import CardDetailModal from '@/app/components/Modals/CardDetailModal';
import { Evaluation } from '../constants/types';
import { ExtendedDeck } from '@/app/api/decks/route';

interface BottomMenuProps {
	currentCard: Card;
	isAnswered: boolean;
	isCorrect: Evaluation;
	answer: string;
	advanceToNextCard: () => void;
	isDisplayJapanese: boolean;
	isProduction: boolean;
}

const BottomMenu: FC<BottomMenuProps> = ({
	currentCard,
	isAnswered,
	isCorrect,
	answer,
	isDisplayJapanese,
	isProduction,
}) => {
	const [isUpsertModalOpen, setIsUpsertModalOpen] = useState<boolean>(false);
	const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
		return () => {
			window.removeEventListener('keydown', handleKeyPress);
		};
	}, [isAnswered, isCorrect, answer]);

	const handleKeyPress = (e: KeyboardEvent) => {
		if (
			(e.target as HTMLElement).tagName === 'INPUT' ||
			(e.target as HTMLElement).tagName === 'TEXTAREA'
		) {
			return;
		}

		switch (e.key) {
			case 'a':
				setIsAnswerModalOpen(true);
				break;
			case 'e':
				setIsUpsertModalOpen(true);
				break;
			case 'Esc':
				setIsAnswerModalOpen(false);
				setIsUpsertModalOpen(false);
				break;
		}
	};

	return (
		<>
			<Box className="absolute bottom-10 flex flex-row gap-10">
				<Button
					disabled={!currentCard.hint}
					variant="outlined"
					startIcon={<QuestionMarkIcon />}
				>
					Show Mnemonic
				</Button>
				<Button
					onClick={() => setIsAnswerModalOpen(true)}
					variant="outlined"
					disabled={!isAnswered && isProduction}
					startIcon={<VisibilityIcon />}
				>
					d Show Answer
				</Button>
				<Button
					variant="outlined"
					disabled={!isAnswered}
					onClick={() => setIsUpsertModalOpen(true)}
					startIcon={<EditIcon />}
				>
					Edit Card
				</Button>
			</Box>
			<CardDetailModal
				open={isAnswerModalOpen}
				onClose={() => setIsAnswerModalOpen(false)}
				card={currentCard}
			/>
			<CardUpsertModal
				open={isUpsertModalOpen}
				card={currentCard}
				onClose={() => setIsUpsertModalOpen(false)}
				isEdit
			/>
		</>
	);
};

export default BottomMenu;
