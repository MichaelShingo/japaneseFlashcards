import { ChangeEvent, Dispatch, FC, MouseEvent, ReactNode, SetStateAction, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { ExtendedDeck } from '@/app/api/decks/route';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from '@mui/material';
import CircularProgressWithLabel from '../CircularProgress/CircularProgressWithLabel';
import { twMerge } from 'tailwind-merge';
import IconWithMenu, { MenuItem as MenuItemType } from '../../molecules/IconWithMenu/IconWithMenu';
import { useRouter } from 'next/navigation';
import { urls } from '@/app/constants/urls';
import { Order } from '@/app/utils/common';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import ConfirmDialogue from '../../molecules/Dialogues/ConfirmDialogue';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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
  children: ReactNode;
  selected: number[];
  setSelected: Dispatch<SetStateAction<readonly number[]>>;
}

const PrivateDecksTable: FC<PrivateDecksTableProps> = ({ headCells, data, selectable, selected, setSelected }) => {
  const router = useRouter();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof ExtendedDeck>();
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenResetSRSModal, setIsOpenResetSRSModal] = useState(false);


  const handleRequestSort = (
    event: MouseEvent<unknown>,
    property: keyof ExtendedDeck,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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
      router.push(`/cards/${id}`);
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
        selected.slice(selectedIndex + 1),
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
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const visibleRows =
    [...data]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const deleteDeck = () => {
    console.log('delete');
  };

  const menuItems: MenuItemType[] = [
    { label: 'Edit', onClick: () => console.log('edit'), action: deleteDeck },
    { label: 'Copy', onClick: () => console.log('copy'), action: deleteDeck },
    { label: 'Delete', onClick: () => setIsOpenDeleteModal(true), action: deleteDeck },
    { label: 'Reset SRS', onClick: () => console.log('reset'), action: deleteDeck },
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
                        className={twMerge([selectable ? 'visible cursor-pointer' : 'invisible cursor-none'])}
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
                      <Box >
                        <CircularProgressWithLabel value={row.totalCards === 0 ? 0 : row.studiedCount / row.totalCards} onClick={() => console.log('progress modal')} />
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.learnCount}</TableCell>
                    <TableCell align="left">{row.reviewCount}</TableCell>
                    <TableCell align="left">
                      {row.public ?
                        <IconButton aria-label="public">
                          <CheckCircleIcon color="primary" />
                        </IconButton> :
                        <IconButton aria-label="private">
                          <CancelIcon />
                        </IconButton>
                      }
                    </TableCell>
                    <TableCell align="left" className="min-w-fit">
                      {row.learnCount + row.reviewCount === 0 ?
                        <Button
                          variant="contained"
                          color="info"
                          onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            router.push(`${urls.study}/${row.id}?free=true`);
                          }}
                        >
                          Free Study
                        </Button> :
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={(e: MouseEvent) => {
                            e.stopPropagation();
                            router.push(`${urls.study}/${row.id}?`);
                          }}
                        >
                          Study ({row.learnCount + row.reviewCount})
                        </Button>
                      }
                    </TableCell>
                    <TableCell align="center" width="50px">
                      <IconWithMenu itemId={row.id} icon={<MoreHorizIcon />} menuItems={menuItems} />
                      <ConfirmDialogue title="Confirm Deck Deletion" open={isOpenDeleteModal} onClose={() => setIsOpenDeleteModal(false)} text={`Are you sure you want to delete this deck? This action is permanent and cannot be undone. All of your study progress concerning this deck will be lost. Deck Title: ${row.title}`} confirmAction={deleteDeck} />
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
        <EnhancedTableToolbar numSelected={selected.length} setSelected={setSelected} selected={selected} data={data} />
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
    </Box>
  );
};

export default PrivateDecksTable;