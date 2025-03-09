import {
	ChangeEvent,
	Dispatch,
	FC,
	MouseEvent,
	ReactNode,
	SetStateAction,
	useState,
} from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ExtendedDeck } from '@/app/api/decks/route';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button, Typography } from '@mui/material';
import CircularProgressWithLabel from './CircularProgressWithLabel';
import { twMerge } from 'tailwind-merge';
import IconWithMenu, { MenuItem as MenuItemType } from './IconWithMenu';
import { useRouter } from 'next/navigation';
import { urls } from '@/app/constants/urls';
import { Order } from '@/app/utils/common';
import EnhancedTableHead from '../../../app/components/Table/EnhancedTableHead';
import EnhancedTableToolbar from '../../../app/components/Table/EnhancedTableToolbar';
import ConfirmModal from '../../../app/components/Modals/ConfirmModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setCurrentStudyCards, setSnackBarData } from '@/redux/features/globalSlice';
import { Deck } from '@prisma/client';
import DeckUpsertModal from './DeckUpsertModal';
import queryString from 'query-string';

export interface HeadCell {
	disablePadding: boolean;
	id: keyof ExtendedDeck;
	label: string;
	numeric: boolean;
}

interface PrivateDecksTableProps {
	headCells: HeadCell[];
	data: ExtendedDeck[];
	selectable?: boolean;
	selected: number[];
	setSelected: Dispatch<SetStateAction<readonly number[]>>;
}

const PrivateDecksTable: FC<PrivateDecksTableProps> = ({
	headCells,
	data,
	selectable,
	selected,
	setSelected,
}) => {
	const router = useRouter();
	const [order, setOrder] = useState<Order>('asc');
	const [orderBy, setOrderBy] = useState<keyof ExtendedDeck>();
	const [page, setPage] = useState(0);
	const [dense, setDense] = useState(false);
	const [rowsPerPage, setRowsPerPage] = useState(20);
	const [currentDeck, setCurrentDeck] = useState<ExtendedDeck | null>(null);
	const [isOpenEditModal, setIsOpenEditModal] = useState(false);
	const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
	const [isOpenResetSRSModal, setIsOpenResetSRSModal] = useState(false);

	const dispatch = useDispatch();
	const queryClient = useQueryClient();

	const getComparator = (order: Order, orderBy: keyof ExtendedDeck) => {
		return (a: ExtendedDeck, b: ExtendedDeck) => {
			let comparison = 0;
			switch (orderBy) {
				case 'learnCount':
					comparison = a.learnCount - b.learnCount;
					break;
				case 'reviewCount':
					comparison = a.reviewCount - b.reviewCount;
					break;
				case 'isPublic':
					comparison = a.isPublic === b.isPublic ? 0 : a.isPublic ? 1 : -1;
					break;
				case 'title':
				default:
					comparison = a.title.localeCompare(b.title);
					break;
			}
			return order === 'asc' ? comparison : -comparison;
		};
	};

	const handleRequestSort = (
		event: MouseEvent<unknown>,
		property: keyof ExtendedDeck
	) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation({
		mutationFn: async (deckId: number) => {
			const response = await fetch(`/api/decks/${deckId}`, {
				method: 'DELETE',
			});
			return response.json();
		},
		onSuccess: (data: Deck) => {
			dispatch(
				setSnackBarData({
					isOpen: true,
					message: `Successfully deleted deck: ${data.title}`,
				})
			);
			queryClient.invalidateQueries();
		},
		onError: (error: Error) => {
			dispatch(setSnackBarData({ isOpen: true, message: error.message }));
		},
	});

	const handleSelectAllClick = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelected = data.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleRowClick = (event: MouseEvent<unknown>, id: number) => {
		if (!selectable) {
			router.push(`/decks/${id}`);
			return;
		}
		const selectedIndex = selected.indexOf(id);
		let newSelected: readonly number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeDense = (event: ChangeEvent<HTMLInputElement>) => {
		setDense(event.target.checked);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

	const visibleRows = [...data]
		.sort(getComparator(order, orderBy))
		.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

	const menuItems: MenuItemType[] = [
		{ label: 'Edit', onClick: () => setIsOpenEditModal(true) },
		{ label: 'Delete', onClick: () => setIsOpenDeleteModal(true) },
		{ label: 'Reset', onClick: () => console.log('reset') },
	];

	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer>
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby="tableTitle"
						size={dense ? 'small' : 'medium'}
					>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={data.length}
							headCells={headCells}
							selectable={selectable}
							setSelected={setSelected}
						/>
						<TableBody>
							{visibleRows.map((row, index) => {
								const isItemSelected = selected.includes(row.id);
								const labelId = `enhanced-table-checkbox-${index}`;

								return (
									<TableRow
										hover
										onClick={(event) => handleRowClick(event, row.id)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
										selected={isItemSelected}
										className="cursor-pointer"
									>
										<TableCell padding="checkbox">
											<Checkbox
												className={twMerge([
													selectable ? 'visible cursor-pointer' : 'invisible cursor-none',
												])}
												color="primary"
												checked={isItemSelected}
												inputProps={{
													'aria-labelledby': labelId,
												}}
											/>
										</TableCell>
										<TableCell
											component="th"
											id={labelId}
											scope="row"
											padding="none"
											className="w-1/5"
										>
											{row.title}
										</TableCell>
										<TableCell align="left">
											<Box>
												<CircularProgressWithLabel
													value={
														row.totalCards === 0 ? 0 : row.studiedCount / row.totalCards
													}
													onClick={() => console.log('progress modal')}
												/>
											</Box>
										</TableCell>
										<TableCell align="left">{row.learnCount}</TableCell>
										<TableCell align="left">{row.reviewCount}</TableCell>
										<TableCell align="left">
											{row.isPublic ? (
												<CheckCircleIcon color="primary" />
											) : (
												<CancelIcon />
											)}
										</TableCell>
										<TableCell align="left" className="min-w-fit">
											{row.learnCount + row.reviewCount === 0 ? (
												<Button
													variant="contained"
													color="info"
													onClick={(e: MouseEvent) => {
														e.stopPropagation();
														router.push(`${urls.study}/${row.id}?free=true`);
													}}
												>
													Free Study
												</Button>
											) : (
												<Button
													variant="contained"
													color="primary"
													onClick={(e: MouseEvent) => {
														e.stopPropagation();
														const queryParams = queryString.stringify({
															cardIds: row.cardIds.join(','),
														});
														router.push(`${urls.study}/${row.id}?`);

														dispatch(setCurrentStudyCards(row.cardIds));
													}}
												>
													Study ({row.learnCount + row.reviewCount})
												</Button>
											)}
										</TableCell>
										<TableCell align="center" width="50px">
											<IconWithMenu
												onClick={() => setCurrentDeck(row)}
												itemId={row.id}
												icon={<MoreHorizIcon />}
												menuItems={menuItems}
											/>
										</TableCell>
									</TableRow>
								);
							})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: (dense ? 33 : 53) * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<EnhancedTableToolbar
					numSelected={selected.length}
					setSelected={setSelected}
					selected={selected}
					data={data}
				/>
				<TablePagination
					rowsPerPageOptions={[20, 50, 100]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>

			<FormControlLabel
				control={<Switch checked={dense} onChange={handleChangeDense} />}
				label="Dense padding"
			/>
			<ConfirmModal
				title="Confirm Deck Deletion"
				open={isOpenDeleteModal}
				onClose={() => setIsOpenDeleteModal(false)}
				confirmAction={() => deleteMutate(currentDeck.id)}
				confirmWithInput
				confirmWithInputValue={currentDeck?.title}
				isLoading={deleteIsPending}
			>
				<Typography variant="body1">
					Are you sure you want to delete this deck? This action is permanent and cannot
					be undone. All of the cards in this deck, including your study progress on these
					cards will be lost.
				</Typography>
				<Typography variant="subtitle1" className="mt-5 mb-2 text-accent">
					Deck to be Deleted: {currentDeck?.title}
				</Typography>
			</ConfirmModal>
			<DeckUpsertModal
				open={isOpenEditModal}
				onClose={() => setIsOpenEditModal(false)}
				isEdit
				deck={currentDeck}
			/>
		</Box>
	);
};

export default PrivateDecksTable;
