'use client';
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from '@mui/material';
import { Card } from '@prisma/client';
import { FC, useState } from 'react';

interface CardsTableProps {
	cardData: Card[];
}

interface Column {
	id: string;
	label: string;
	minWidth?: number;
	align?: 'right';
	format?: (value: number) => string;
}

const CardsTable: FC<CardsTableProps> = ({ cardData }) => {
	const columns: readonly Column[] = [
		{ id: 'hiragana', label: 'Hiragana' },
		{ id: 'japanese', label: 'Japanese' },
		{ id: 'english', label: 'English' },
		{ id: 'englishSynonyms', label: 'English Synonyms' },
	];

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(50);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};
	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{ width: '100%', mb: 2 }}>
				<TableContainer className="max-h-[70vh] min-h-[70vh]">
					<Table
						sx={{ minWidth: 750 }}
						aria-labelledby="tableTitle"
						size="small"
						stickyHeader
					>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{cardData
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((card) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={card.id}>
											{columns.map((column) => {
												const value = card[column.id];
												return (
													<TableCell key={column.id} align={column.align}>
														{column.format && typeof value === 'number'
															? column.format(value)
															: value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[50, 100, 200, 500, 1000]}
					component="div"
					count={cardData.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	);
};

export default CardsTable;
