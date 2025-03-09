'use client';
import DefaultLayout from '@/app/components/DefaultLayout';
import useDebounce from '@/app/customHooks/useDebounce';
import useCardQueries from '@/app/queries/useCardQueries';
import useDeckQueries from '@/app/queries/useDeckQueries';
import CardsTable from '@/features/cards/components/CardsTable';
import {
	Box,
	CircularProgress,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';

const DeckDetail = () => {
	const params = useParams();
	const { deckId } = params;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const debouncedSearchTerm = useDebounce(searchTerm, 250);

	const { data: deckData, isPending: isPendingDeck } = useDeckQueries(() => {}, deckId);
	const { dataAll: cardData, isPendingAll: isPendingCard } = useCardQueries(
		() => {},
		deckId
	);

	return (
		<DefaultLayout>
			{isPendingCard || isPendingDeck ? (
				<CircularProgress />
			) : (
				<>
					<Box className="flex gap-4">
						<Typography variant="h1" component="h1">
							{deckData.title}
						</Typography>
						<Tooltip
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
							<HelpIcon className="translate-y-12" />
						</Tooltip>
					</Box>
					<TextField
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						variant="filled"
						label="Search"
					/>
					<CardsTable cardData={cardData} />
				</>
			)}
		</DefaultLayout>
	);
};

export default DeckDetail;
