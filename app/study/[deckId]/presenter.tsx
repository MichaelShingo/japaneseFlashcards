'use client';
import { studyModeTypeMap } from "@/prisma/seedData/studyModes";
import { Box, Button, ButtonGroup, CircularProgress, TextField, Typography } from "@mui/material";
import { Card } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import CardUpsertModal from "@/app/components/molecules/Modals/CardUpsertModal";
import AnswerModal from "@/app/components/molecules/Modals/AnswerModal";
import { twMerge } from "tailwind-merge";
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import Timer from "@/app/components/atoms/Timer/Timer";
import { ExtendedDeck, StudyUnit } from "./page";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

interface StudyPresenterProps {
  studyOrder: StudyUnit[];
  setStudyOrder: Dispatch<SetStateAction<StudyUnit[]>>;
  currentCardIndex: number;
  setCurrentCardIndex: Dispatch<SetStateAction<number>>;
  currentCard: Card;
  deckIsPending: boolean;
  deckData: ExtendedDeck;
  cardIsPending: boolean;
  submitSelfRating: (rating: number) => void;
}

const StudyPresenter: FC<StudyPresenterProps> = ({
  studyOrder,
  setStudyOrder,
  currentCardIndex,
  setCurrentCardIndex,
  currentCard,
  deckIsPending,
  deckData,
  cardIsPending,
  submitSelfRating,
}) => {
  const router = useRouter();
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState<boolean>(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const calcSubmitButtonColor = (): 'success' | 'error' | 'primary' => {
    if (isAnswered && isCorrect) {
      return 'success';
    } else if (isAnswered && !isCorrect) {
      return 'error';
    } else {
      return 'primary';
    }
  };

  const advanceToNextCard = () => {
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
    } else {
      setStudyOrder([...studyOrder, studyOrder[currentCardIndex]]);
    }
    if (currentCardIndex >= studyOrder.length - 1) {
      router.push('/decks');
      return;
    }
    setCurrentCardIndex((value) => value + 1);
    setIsCorrect(null);
    setAnswer('');
    setIsAnswered(false);
    setSecondsElapsed(0);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key) {
      case 'm':
        break;
      case 'a':
        setIsAnswerModalOpen(true);
        break;
      case 'e':
        setIsUpsertModalOpen(true);
        break;
      case 'Enter':
        isAnswered && advanceToNextCard();
        break;
      case 'Esc':
        setIsAnswerModalOpen(false);
        setIsUpsertModalOpen(false);
        break;
    }
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      isAnswered ? advanceToNextCard() : submitAnswer();
      return;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isAnswered, isCorrect, answer]);

  const isProduction = !deckIsPending && deckData.studyMode.type === studyModeTypeMap.production;
  const displayJapanese = studyOrder[currentCardIndex].studyType === 'displayJapanese';

  const checkAnswer = (): boolean => {
    if (displayJapanese) {
      if (answer.toLowerCase() === currentCard.english.toLowerCase()) {
        return true;
      }
      for (let synonym of currentCard.englishSynonyms) {
        if (synonym.toLowerCase() === answer) {
          return true;
        }
      }
    } else {
      if (answer === currentCard.japanese) {
        return true;
      }
      for (let synonym of currentCard.japaneseSynonyms) {
        if (synonym === answer) {
          return true;
        }
      }
    }
    return false;
  };

  const submitAnswer = () => {
    if (answer === '') {
      return;
    }

    setIsAnswered(true);

    if (checkAnswer()) {
      setIsCorrect(true);
      // update card SRS
      // show indication of next SRS level
    } else {
      setIsCorrect(false);
      // update card SRS
    }
    setIsPopoverVisible(true);

  };


  return (
    <Box className="flex items-center flex-col gap-6 justify-center w-full h-[95vh] overflow-hidden">
      {!currentCard || cardIsPending || deckIsPending ?
        <CircularProgress />
        :
        <>
          {/* <ResultPopover isCorrect={isCorrect} visible={isPopoverVisible} setVisible={setIsPopoverVisible} /> */}
          <Box className="left-0 top-0 h-2 absolute bg-ui-02 w-[100vw]" >
            <Box className="bg-accent h-full transition-all duration-500" sx={{ width: `${correctCount / studyOrder?.length * 100}%` }} />
          </Box>
          <Box className="absolute top-3 left-2">
            <Button startIcon={<CloseIcon className="aspect-square h-[28px] w-[28px]" />} size="small" color="info" onClick={() => router.push('/decks')}>
              Exit Study Mode
            </Button>
          </Box>
          <Box className="absolute top-3 right-3">
            <Box className="flex flex-row">
              <Button disabled>Progress: {`${currentCardIndex}/${studyOrder.length}`} ({Math.round(correctCount / studyOrder?.length * 100)}%)</Button>
              <Timer secondsElapsed={secondsElapsed} setSecondsElapsed={setSecondsElapsed} isAnswered={isAnswered} />
              <Button
                color={isAnswered ?
                  (isCorrect ? 'success' : 'error')
                  :
                  'info'}
                startIcon={isAnswered ?
                  (isCorrect ? <KeyboardDoubleArrowUpIcon /> : <KeyboardDoubleArrowDownIcon />)
                  :
                  <LeaderboardIcon className="" />} size="small"
              >
                Level: {currentCard.srsLevel}
              </Button>
            </Box>
          </Box>
          <Typography variant="h1">
            {displayJapanese ? currentCard.japanese : currentCard.english}
          </Typography>

          {isProduction ?
            <>
              <TextField
                className={twMerge([
                  'w-[50vw] min-w-[300px] max-w-[350px] [&_.MuiInputBase-input]:text-center',
                  isAnswered && (isCorrect ? 'bg-green-500/50' : 'bg-red-500/50')
                ])} disabled={isAnswered}
                variant="outlined"
                autoFocus
                focused
                placeholder={displayJapanese ? 'Type in English' : '日本語を入力してください'}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent) => handleEnterPress(e)}
                inputRef={input => input && input.focus()} />
              <Button disabled={answer === ''} variant={isAnswered ? 'outlined' : 'contained'} color={calcSubmitButtonColor()} size="large" onClick={isAnswered ? advanceToNextCard : submitAnswer}>
                {isAnswered ? 'Next Card' : 'Submit Answer'}
              </Button>
            </>
            :
            <ButtonGroup variant="contained" aria-label="Basic button group">
              <Button color="secondary" startIcon={<CloseIcon />} className="min-w-[175px]" size="large" onClick={() => submitSelfRating(0)}>Incorrect</Button>
              <Button startIcon={<CheckIcon />} className="min-w-[175px]" size="large" onClick={() => submitSelfRating(1)}>Correct</Button>
            </ButtonGroup>
          }
          <Box className="absolute bottom-10 flex flex-row gap-10">
            <Button disabled={!currentCard.hint} variant="outlined" startIcon={<QuestionMarkIcon />} >Show Mnemonic</Button>
            <Button onClick={() => setIsAnswerModalOpen(true)} variant="outlined" disabled={!isAnswered} startIcon={<VisibilityIcon />} >Show Answer</Button>
            <Button variant="outlined" disabled={!isAnswered} onClick={() => setIsUpsertModalOpen(true)} startIcon={<EditIcon />}>Edit Card</Button>
          </Box>
          <AnswerModal open={isAnswerModalOpen} onClose={() => setIsAnswerModalOpen(false)} card={currentCard} displayJapanese={displayJapanese} />
          <CardUpsertModal open={isUpsertModalOpen} card={currentCard} onClose={() => setIsUpsertModalOpen(false)} isEdit />
        </>
      }
    </Box >
  );
};

export default StudyPresenter;