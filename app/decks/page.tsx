'use client';

import { Box, Button, Divider, Input, MenuItem, OutlinedInput, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import DefaultTabs, { Tab } from "../components/Tabs/Tabs";
import MultiSelect from "../components/MultiSelect/MultiSelect";
import { ValueLabel } from "../utils/common";

const tabValues: Record<string, string> = {
    yourDecks: 'Your Decks',
    publicDecks: 'Public Decks',
};

const filterOptions: ValueLabel[] = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'hasReviews', label: 'Has Reviews' },
    { value: 'noReviews', label: 'No Reviews' },
    { value: 'hasLearn', label: 'Has Learn' },
];

const Decks: FC = () => {
    const [currentTab, setCurrentTab] = useState<string>(tabValues.yourDecks);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    const handleFilterChange = (e: SelectChangeEvent<typeof selectedFilters>) => {
        const value = e.target.value;
        setSelectedFilters(typeof value === 'string' ? value.split(',') : value);
    };
    const handleTabChange = (e: SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    };

    const tabs: Tab[] = [
        { label: tabValues.yourDecks, value: tabValues.yourDecks },
        { label: tabValues.publicDecks, value: tabValues.publicDecks },
    ];

    return (
        <Box className="max-w-[1000px] w-[80%] h-fit min-h-[100px] mx-auto">
            <Typography variant="h1" component="h1">
                Decks
            </Typography>
            <DefaultTabs tabs={tabs} currentTab={currentTab} handleChange={handleTabChange} />
            {currentTab === tabValues.yourDecks && (
                <Stack direction="row" gap="15px" justifyContent="left" className="my-5" >
                    <TextField variant="filled" label="Search" />
                    <MultiSelect
                        values={selectedFilters}
                        onChange={handleFilterChange}
                        options={filterOptions}
                    />
                    <Divider variant="inset" />
                    <Button variant="outlined">Mix and Match</Button>
                    <Button variant="contained">Study All</Button>
                </Stack>
            )}
            {currentTab === tabValues.publicDecks && (
                <Typography variant="h2" component="h2">
                    Public Decks
                </Typography>
            )}
        </Box>
    );
};

export default Decks;