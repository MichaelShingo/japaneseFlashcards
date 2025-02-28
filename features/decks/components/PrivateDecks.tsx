'use client';
import {
	Button,
	CircularProgress,
	Divider,
	FormControl,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import MultiSelect from '../../../app/components/MultiSelect';
import { ValueLabel } from '@/app/utils/common';
import { useState } from 'react';
import PrivateDecksTable, { HeadCell } from './PrivateDecksTable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { urls } from '@/app/constants/urls';
import useDebounce from '@/app/customHooks/useDebounce';
import queryString from 'query-string';

const filterOptions: ValueLabel[] = [
	{ value: 'public', label: 'Public' },
	{ value: 'private', label: 'Private' },
	{ value: 'hasReviews', label: 'Has Reviews' },
	{ value: 'noReviews', label: 'No Reviews' },
	{ value: 'hasLearn', label: 'Has Learn' },
];

const mapStringsToObject = (strings: string[]): Record<string, boolean> => {
	return strings.reduce(
		(acc, str) => {
			acc[str] = true;
			return acc;
		},
		{} as Record<string, boolean>
	);
};

const tableHeadCells: HeadCell[] = [
	// {
	//     id: 0,
	//     numeric: false,
	//     disablePadding: true,
	//     label: '',
	// },
	{
		id: 'title',
		numeric: false,
		disablePadding: true,
		label: 'Title',
	},
	{
		id: 'progress',
		numeric: false,
		disablePadding: true,
		label: 'Progress',
	},
	{
		id: 'learnCount',
		numeric: false,
		disablePadding: true,
		label: 'Learn',
	},
	{
		id: 'reviewCount',
		numeric: false,
		disablePadding: true,
		label: 'Reviews',
	},
	{
		id: 'isPublic',
		numeric: false,
		disablePadding: true,
		label: 'Public',
	},
	{
		id: 'study',
		numeric: false,
		disablePadding: true,
		label: '',
	},
	{
		id: null,
		numeric: false,
		disablePadding: true,
		label: '',
	},
];

const PrivateDecks = () => {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState<string>('');
	const debouncedSearchTerm = useDebounce(searchTerm, 250);
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const [selectable, setSelectable] = useState<boolean>(false);
	const [studyQueue, setStudyQueue] = useState<number[]>([]);
	const queryClient = useQueryClient();
	let selectedFiltersString = '';

	selectedFilters.forEach((filter, index) => {
		if (index === selectedFilters.length - 1) {
			selectedFiltersString += `&${filter}=true`;
		}
	});
	const { isPending, isError, data, error } = useQuery({
		queryKey: ['decks', debouncedSearchTerm, selectedFilters],
		queryFn: async () => {
			const queryParams = queryString.stringify({
				search: debouncedSearchTerm,
				...mapStringsToObject(selectedFilters),
			});
			const response = await fetch(`/api/decks?${queryParams}`);
			return await response.json();
		},
	});

	const mutation = useMutation({
		mutationFn: () => {
			return fetch('/api/decks', {
				method: 'POST',
				body: JSON.stringify({ title: 'title' }),
				headers: {
					'Content-Type': 'application/json',
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['decks'] });
		},
	});

	const handleSelectClick = () => {
		if (selectable && studyQueue.length > 0) {
			router.push(`${urls.study}/?ids=${studyQueue.join(',')}`);
			return;
		}
		setSelectable(!selectable);
	};

	const handleFilterChange = (e: SelectChangeEvent<typeof selectedFilters>) => {
		const value = e.target.value;
		setSelectedFilters(typeof value === 'string' ? value.split(',') : value);
	};

	return (
		<>
			<FormControl className="flex flex-row gap-[15px] my-5">
				<TextField
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					variant="filled"
					label="Search"
				/>
				<MultiSelect
					values={selectedFilters}
					onChange={handleFilterChange}
					options={filterOptions}
				/>
				<Divider orientation="vertical" flexItem />
				<Button
					color={selectable ? 'secondary' : 'primary'}
					onClick={handleSelectClick}
					variant={selectable ? 'contained' : 'outlined'}
				>
					{selectable
						? studyQueue.length > 0
							? `Study ${studyQueue.length} deck(s)`
							: 'Stop Selecting'
						: 'Select Decks to Study'}
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						router.push(urls.study);
					}}
				>
					Study All
				</Button>
			</FormControl>
			{isError && <div>Error: {error.message}</div>}
			{isPending ? (
				<CircularProgress />
			) : (
				<PrivateDecksTable
					headCells={tableHeadCells}
					data={data}
					selectable={selectable}
					selected={studyQueue}
					setSelected={setStudyQueue}
				></PrivateDecksTable>
			)}
		</>
	);
};

export default PrivateDecks;
