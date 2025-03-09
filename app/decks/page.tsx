'use client';
import { Box, Fab, TextField, Typography } from '@mui/material';
import { FC, SyntheticEvent, useState } from 'react';
import DefaultTabs, { Tab } from '../components/Tabs';
import PrivateDecks from '../../features/decks/components/PrivateDecks';
import PublicDecks from '../../features/decks/components/PublicDecks';
import AddIcon from '@mui/icons-material/Add';
import DeckUpsertModal from '../../features/decks/components/DeckUpsertModal';
import DefaultLayout from '../components/DefaultLayout';
import useDebounce from '../customHooks/useDebounce';

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
		<DefaultLayout>
			<Typography variant="h1" component="h1">
				Decks
			</Typography>
			<DefaultTabs tabs={tabs} currentTab={currentTab} handleChange={handleTabChange} />
			{currentTab === tabValues.yourDecks && <PrivateDecks />}
			{currentTab === tabValues.publicDecks && <PublicDecks />}
			<Fab
				className="absolute right-10 bottom-10"
				color="primary"
				onClick={() => setIsOpen(true)}
				aria-label="add"
			>
				<AddIcon />
			</Fab>
			<DeckUpsertModal open={isOpen} onClose={() => setIsOpen(false)} />
		</DefaultLayout>
	);
};

export default Decks;
