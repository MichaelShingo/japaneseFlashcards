'use client';
import { Button, CircularProgress, Divider, FormControl, SelectChangeEvent, TableCell, TextField } from "@mui/material";
import MultiSelect from "../../atoms/MultiSelect/MultiSelect";
import { ValueLabel } from "@/app/utils/common";
import { useState } from "react";
import CustomTable, { HeadCell } from "../../atoms/Table/Table";
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
} from '@tanstack/react-query';
import { ExtendedDeck } from "@/app/api/decks/route";
const filterOptions: ValueLabel[] = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'hasReviews', label: 'Has Reviews' },
    { value: 'noReviews', label: 'No Reviews' },
    { value: 'hasLearn', label: 'Has Learn' },
];

const tableHeadCells: readonly HeadCell[] = [
    // {
    //     id: 0,
    //     numeric: false,
    //     disablePadding: true,
    //     label: '',
    // },
    {
        id: 1,
        numeric: false,
        disablePadding: true,
        label: 'Title',
    },
    {
        id: 2,
        numeric: false,
        disablePadding: true,
        label: 'Progress',
    },
    {
        id: 3,
        numeric: false,
        disablePadding: true,
        label: 'Learn',
    },
    {
        id: 4,
        numeric: false,
        disablePadding: true,
        label: 'Reviews',
    },
    {
        id: 5,
        numeric: false,
        disablePadding: true,
        label: 'Public',
    },
    {
        id: 6,
        numeric: false,
        disablePadding: true,
        label: '',
    },
    {
        id: 7,
        numeric: false,
        disablePadding: true,
        label: '',
    },
];

const PrivateDecks = () => {
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [selectable, setSelectable] = useState<boolean>(false);
    const [studyQueue, setStudyQueue] = useState<number[]>([]);
    const queryClient = useQueryClient();

    const { isPending, isError, data, error } = useQuery({
        queryKey: ['decks'], queryFn: async () => {
            const response = await fetch('/api/decks');
            return response.json();
        }
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
        }
    });

    const handleMixAndMatchClick = () => {
        if (selectable && studyQueue.length > 0) {
            console.log('go to study page with selections');
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
                <TextField variant="filled" label="Search" />
                <MultiSelect
                    values={selectedFilters}
                    onChange={handleFilterChange}
                    options={filterOptions}
                />
                <Divider orientation="vertical" flexItem />
                <Button
                    color={selectable ? 'secondary' : 'primary'}
                    onClick={handleMixAndMatchClick}

                    variant={selectable ? 'contained' : 'outlined'}>
                    {selectable ?
                        studyQueue.length > 0 ? `Study ${studyQueue.length} deck(s)` : 'Stop Selecting'
                        :
                        'Select Decks to Study'
                    }

                </Button>
                <Button variant="contained">Study All</Button>
            </FormControl>
            {isError && <div>Error: {error.message}</div>}
            {isPending ?
                <CircularProgress />
                :
                <CustomTable headCells={tableHeadCells} data={data} selectable={selectable} selected={studyQueue} setSelected={setStudyQueue}>
                </CustomTable>
            }
        </>
    );
};

export default PrivateDecks;