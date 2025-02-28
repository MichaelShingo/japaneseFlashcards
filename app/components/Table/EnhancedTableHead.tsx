import { ExtendedDeck } from '@/app/api/decks/route';
import { Order } from '@/app/utils/common';
import { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react';
import { HeadCell } from '../../../features/decks/components/PrivateDecksTable';
import {
	Box,
	Checkbox,
	TableCell,
	TableHead,
	TableRow,
	TableSortLabel,
} from '@mui/material';
import { twMerge } from 'tailwind-merge';
import { visuallyHidden } from '@mui/utils';

interface EnhancedTableProps {
	numSelected: number;
	onRequestSort: (event: MouseEvent<unknown>, property: keyof ExtendedDeck) => void;
	onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	headCells: HeadCell[];
	selectable?: boolean;
	setSelected: Dispatch<SetStateAction<readonly number[]>>;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const {
		onSelectAllClick,
		order,
		orderBy,
		numSelected,
		rowCount,
		onRequestSort,
		headCells,
	} = props;

	const createSortHandler =
		(property: keyof ExtendedDeck) => (event: MouseEvent<unknown>) => {
			onRequestSort(event, property);
		};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						className={twMerge([
							props.selectable ? 'visible cursor-pointer' : 'invisible cursor-none',
						])}
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							'aria-label': 'select all desserts',
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'normal'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

export default EnhancedTableHead;
