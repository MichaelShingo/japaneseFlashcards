'use client';
import DefaultLayout from '@/app/components/DefaultLayout';
import useDebounce from '@/app/customHooks/useDebounce';
import useCardQueries from '@/app/queries/useCardQueries';
import useDeckQueries from '@/app/queries/useDeckQueries';
import CardsTable from '@/features/cards/components/CardsTable';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import {
	Box,
	CircularProgress,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import HelpIcon from '@mui/icons-material/Help';
import CardSortSelect from '@/features/cards/components/CardSortSelect';
import { CardSortingKeys } from '@/features/cards/types/types';

const DeckDetail = () => {
	const params = useParams();
	const { deckId } = params;

	const [searchTerm, setSearchTerm] = useState<string>('');
	const [isGridView, setIsGridView] = useState<boolean>(true);
	const [sortingValue, setSortingValue] = useState<CardSortingKeys>('englishDesc');
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
					<Box className="flex gap-4 items-center justify-center">
						<Typography variant="h1" component="h1">
							{deckData.title}
						</Typography>
					</Box>
					<Box className="flex flex-row gap-4 items-center">
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
						<Box>
							<IconButton onClick={() => setIsGridView((val) => !val)}>
								{isGridView ? <TableRowsIcon /> : <GridViewIcon />}
							</IconButton>
						</Box>
					</Box>
					{isGridView ? <></> : <CardsTable cardData={cardData} />}
				</>
			)}
		</DefaultLayout>
	);
};

export default DeckDetail;
