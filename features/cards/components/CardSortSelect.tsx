import { SortingOption } from '@/app/types/types';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { FC } from 'react';
import { CardSortingKeys } from '../types/types';

const CardSortingValues: Record<CardSortingKeys, string> = {
	englishDesc: 'English Descending',
	englishAsc: 'English Ascending',
	japaneseDesc: 'Japanese Descending',
	japaneseAsc: 'Japanese Ascending',
};

const sortingOptions: SortingOption[] = Object.entries(CardSortingValues).map(
	([value, label], index) => ({
		order: index + 1,
		value,
		label,
	})
);

interface CardSortSelectProps {
	currentValue: string;
	handleChange: (e: SelectChangeEvent) => void;
}

const CardSortSelect: FC<CardSortSelectProps> = ({ currentValue, handleChange }) => {
	return (
		<Select variant="filled" onChange={handleChange} value={currentValue}>
			{sortingOptions.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</Select>
	);
};

export default CardSortSelect;
