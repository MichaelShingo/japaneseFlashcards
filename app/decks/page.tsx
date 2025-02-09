'use client';
import { Box, Typography } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import DefaultTabs, { Tab } from "../components/atoms/Tabs/Tabs";
import PrivateDecks from "../components/organisms/PrivateDecks/PrivateDecks";
import PublicDecks from "../components/organisms/PublicDecks/PublicDecks";

const tabValues: Record<string, string> = {
    yourDecks: 'Your Decks',
    publicDecks: 'Public Decks',
};

const Decks: FC = () => {
    const [currentTab, setCurrentTab] = useState<string>(tabValues.yourDecks);

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
                <PrivateDecks />
            )}
            {currentTab === tabValues.publicDecks && (
                <PublicDecks />
            )}
        </Box>
    );
};

export default Decks;