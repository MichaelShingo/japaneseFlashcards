import { Dispatch, FC, SetStateAction } from 'react';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';

import {
	Box,
	CircularProgress,
	FormControlLabel,
	IconButton,
	SelectChangeEvent,
	Stack,
	Switch,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import CardSortSelect from '@/features/cards/components/CardSortSelect';
import { CardSortingKeys } from '@/features/cards/types/types';
import { ExtendedDeck } from '@/app/study/[deckId]/page';

interface CardsHeaderProps {
	deckData: ExtendedDeck;
	isPendingDeck: boolean;
	searchTerm: string;
	setSearchTerm: Dispatch<SetStateAction<string>>;
	sortingValue: string;
	setSortingValue: Dispatch<SetStateAction<string>>;
	isSelectMode: boolean;
	setIsSelectMode: Dispatch<SetStateAction<boolean>>;
	isGridView: boolean;
	setIsGridView: Dispatch<SetStateAction<boolean>>;
}
const CardsHeader: FC<CardsHeaderProps> = ({
	deckData,
	isPendingDeck,
	searchTerm,
	setSearchTerm,
	sortingValue,
	setSortingValue,
	isSelectMode,
	setIsSelectMode,
	isGridView,
	setIsGridView,
}) => {
	return (
		<>
			{isPendingDeck ? (
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
				</>
			)}
		</>
	);
};

export default CardsHeader;
