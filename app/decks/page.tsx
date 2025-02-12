'use client';
import { Box, Fab, Typography } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import DefaultTabs, { Tab } from "../components/atoms/Tabs/Tabs";
import PrivateDecks from "../components/organisms/PrivateDecks/PrivateDecks";
import PublicDecks from "../components/organisms/PublicDecks/PublicDecks";
import AddIcon from '@mui/icons-material/Add';
import DeckUpsertDialogue from "../components/molecules/Dialogues/DeckUpsertDialogue";


const tabValues: Record<string, string> = {
  yourDecks: 'Your Decks',
  publicDecks: 'Public Decks',
};

const Decks: FC = () => {
  const [currentTab, setCurrentTab] = useState<string>(tabValues.yourDecks);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      <Fab
        className="absolute right-10 bottom-10" color="primary" onClick={() => setIsOpen(true)} aria-label="add">
        <AddIcon />
      </Fab>
      <DeckUpsertDialogue open={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default Decks;