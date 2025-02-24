'use client';
import { studyModeIdentifiers, studyModeTypeMap } from "@/prisma/seedData/studyModes";
import { Box, Button, ButtonGroup, CircularProgress, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Card, Deck, StudyMode } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
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

type StudyUnit = {
  cardId: number;
  studyType: 'displayEnglish' | 'displayJapanese';
  reviewIncorrect: boolean;
};

const Study = () => {
  const params = useParams();
  const router = useRouter();

  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState<boolean>(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState<boolean>(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [studyOrder, setStudyOrder] = useState<StudyUnit[]>([{ cardId: -1, studyType: 'displayEnglish', reviewIncorrect: false }]);

  const calcSubmitButtonColor = (): 'success' | 'error' | 'primary' => {
    if (isAnswered && isCorrect) {
      return 'success';
    } else if (isAnswered && !isCorrect) {
      return 'error';
    } else {
      return 'primary';
    }
  };

  const { deckId } = params;

  const { data: cardData, isPending: cardIsPending, isError, } = useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: async () => {
      const queryParams = queryString.stringify({ dueForStudy: true, deckId: deckId });
      const response = await fetch(`/api/cards/?${queryParams}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    },
  });

  const submitSelfRating = (rating: number) => {
    console.log(rating);
  };

  interface ExtendedDeck extends Deck {
    studyMode: StudyMode;
  }

  const { data: deckData, isPending: deckIsPending } = useQuery<ExtendedDeck>({
    queryKey: ['deck'],
    queryFn: async () => {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch.');
      }
      return response.json();
    },
  });

  useEffect(() => {
    // for the study sequence, order ONLY the cardIds and whether or not it is japanese or English 
    // when cards are edited and refetched, order of cardData doesn't matter, because you can just look up the 's data based on the ID

    if (!isFirstLoad || !cardData || !deckData) {
      return;
    }

    const displayJapanese = [
      studyModeIdentifiers.japaneseRecognition,
      studyModeIdentifiers.produceEnglish,
      studyModeIdentifiers.produceJapaneseAndEnglish,
      studyModeIdentifiers.japaneseAndEnglishRecognition
    ].includes(deckData.studyMode.identifier);

    const displayEnglish = [
      studyModeIdentifiers.englishRecognition,
      studyModeIdentifiers.produceJapanese,
      studyModeIdentifiers.produceJapaneseAndEnglish,
      studyModeIdentifiers.japaneseAndEnglishRecognition,
    ].includes(deckData.studyMode.identifier);

    const order: StudyUnit[] = [];
    for (let card of cardData) {
      if (displayJapanese) {
        order.push({
          cardId: card.id,
          studyType: 'displayJapanese',
          reviewIncorrect: false,
        });
      }
      if (displayEnglish) {
        order.push({
          cardId: card.id,
          studyType: 'displayEnglish',
          reviewIncorrect: false,
        });
      }
    }

    setStudyOrder(order);
    setIsFirstLoad(false);
  }, [cardData, deckData, isFirstLoad]);

  const currentCard = cardData && !cardIsPending && cardData?.find((card) => card.id === studyOrder[currentCardIndex].cardId);




  const advanceToNextCard = () => {
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
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
      // move current card to later point in the deck, mark it as wrong
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
              <Button disabled>Progress: {`${correctCount}/${studyOrder.length}`} ({Math.round(correctCount / studyOrder?.length * 100)}%)</Button>
              <Timer secondsElapsed={secondsElapsed} setSecondsElapsed={setSecondsElapsed} isAnswered={isAnswered} />
              <Button startIcon={<LeaderboardIcon className="" />} size="small" color="info">
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

export default Study;