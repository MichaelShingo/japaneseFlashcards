'use client';
import { Box, Button, IconButton, useColorScheme, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Card } from '@prisma/client';
import { Dispatch, FC, SetStateAction } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Timer from '@/features/study/components/Timer';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { StudyUnit } from '@/app/study/[deckId]/page';
import { Evaluation } from '../constants/types';
import { EvaluationColors } from '../constants/maps';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '@/redux/store';
import { setColorMode } from '@/redux/features/globalSlice';

interface TopBarProps {
	correctCount: number;
	studyOrder: StudyUnit[];
	currentCardIndex: number;
	secondsElapsed: number;
	setSecondsElapsed: Dispatch<SetStateAction<number>>;
	isAnswered: boolean;
	isCorrect: Evaluation;
	currentCard: Card;
}

const TopBar: FC<TopBarProps> = ({
	correctCount,
	studyOrder,
	currentCardIndex,
	secondsElapsed,
	setSecondsElapsed,
	isAnswered,
	isCorrect,
	currentCard,
}) => {
	const router = useRouter();
	const colorMode = useAppSelector((state) => state.globalReducer.value.colorMode);
	const dispatch = useDispatch();

	return (
		<>
			<Box className="left-0 top-0 h-2 absolute w-[100vw]">
				<Box
					className="bg-accent h-full transition-all duration-500"
					sx={{
						width: `${(correctCount / studyOrder?.length) * 100}%`,
						backgroundColor: 'primary',
					}}
				/>
			</Box>
			<Box className="absolute top-3 left-2">
				<Button
					startIcon={<CloseIcon className="aspect-square h-[28px] w-[28px]" />}
					size="small"
					color="info"
					onClick={() => router.push('/decks')}
				>
					Exit Study Mode
				</Button>
			</Box>
			<Box className="absolute top-3 right-3">
				<Box className="flex flex-row">
					<IconButton
						onClick={() =>
							dispatch(
								setColorMode(
									colorMode === 'light' || colorMode === undefined ? 'dark' : 'light'
								)
							)
						}
					>
						<DarkModeIcon />
					</IconButton>
					<Button disabled>
						Progress: {`${currentCardIndex}/${studyOrder.length}`} (
						{Math.round((correctCount / studyOrder?.length) * 100)}%)
					</Button>
					<Timer
						secondsElapsed={secondsElapsed}
						setSecondsElapsed={setSecondsElapsed}
						isAnswered={isAnswered}
					/>
					<Button
						color={isAnswered ? EvaluationColors[isCorrect] : 'info'}
						startIcon={
							isAnswered ? (
								isCorrect ? (
									<KeyboardDoubleArrowUpIcon />
								) : (
									<KeyboardDoubleArrowDownIcon />
								)
							) : (
								<LeaderboardIcon />
							)
						}
						size="small"
					>
						Level: {currentCard.srsLevel}
					</Button>
				</Box>
			</Box>
		</>
	);
};

export default TopBar;
