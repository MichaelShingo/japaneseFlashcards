'use client';
import { studyModeTypeMap } from "@/prisma/seedData/studyModes";
import { Box, Button, ButtonGroup, CircularProgress, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import { Card, Deck, StudyMode } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import CheckIcon from '@mui/icons-material/Check';
import CardUpsertModal from "@/app/components/molecules/Modals/CardUpsertModal";


const Study = () => {
  const params = useParams();
  const router = useRouter();
  const [isUpsertModalOpen, setIsUpsertModalOpen] = useState<boolean>(false);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const calcSubmitButtonColor = (): string => {
    if (isAnswered && isCorrect) {
      return 'success';
    } else if (isAnswered && !isCorrect) {
      return 'error';
    } else {
      return 'primary';
    }
  };

  const { deckId } = params;

  const { data: cardData, isPending: cardIsPending, isError } = useQuery<Card[]>({
    queryKey: ['cards'],
    queryFn: async () => {
      const queryParams = queryString.stringify({ dueForStudy: true, deckId: deckId });
      const response = await fetch(`/api/cards/?${queryParams}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return await response.json();
    }
  });

  const currentCard = !cardIsPending && cardData[currentCardIndex];

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
    }
  });

  const submitAnswer = () => {
    if (answer === '') {
      return;
    }
    setIsAnswered(true);
    if (answer.toLowerCase() === currentCard.english.toLowerCase()) {
      setIsCorrect(true);

      // update card SRS
      // show indication of next SRS level
    } else {
      setIsCorrect(false);
      // move current card to later point in the deck, mark it as wrong
      // update card SRS

    }
  };

  const advanceToNextCard = () => {
    if (isCorrect) {
      setCorrectCount((value) => value + 1);
    }
    if (currentCardIndex === cardData.length - 1) {
      router.push('/decks');
    }
    setCurrentCardIndex((value) => value + 1);
    setIsCorrect(null);
    setAnswer('');
    setIsAnswered(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
      return;
    }

    switch (e.key) {
      case 'm':
        break;
      case 'a':
        break;
      case 'e':
        break;
      case 'Esc':
        break;
    }
  };

  const handleEnterPress = (e: KeyboardEvent) => {
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

  return (
    <Box className="flex items-center flex-col gap-6 justify-center w-full h-[95vh] overflow-hidden">
      {cardIsPending || deckIsPending ?
        <CircularProgress />
        :
        <>
          <Box className="left-0 top-0 h-2 absolute bg-ui-02 w-[100vw]" >
            <Box className="bg-accent h-full transition-all duration-500" sx={{ width: `${correctCount / cardData.length * 100}%` }} />
          </Box>
          <Box className="absolute top-3 left-2">
            <Box className="flex flex-row items-center">
              <Button startIcon={<CloseIcon className="aspect-square h-[28px] w-[28px]" />} size="small" color="info">
                Exit Study Mode
              </Button>
            </Box>
          </Box>
          <Typography variant="h1">
            {cardData[currentCardIndex].japanese}
          </Typography>

          {!isProduction ?
            <>
              <TextField className="w-[50vw] min-w-[300px] max-w-[350px] [&_.MuiInputBase-input]:text-center" variant="outlined" placeholder="Type in English" value={answer} onChange={(e) => setAnswer(e.target.value)} onKeyDown={(e: React.KeyboardEvent) => handleEnterPress(e)} />
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
          <ButtonGroup variant="outlined" className="absolute bottom-10">
            <Button startIcon={<QuestionMarkIcon />} >Show Mnemonic</Button>
            <Button startIcon={<VisibilityIcon />} >Show Answer</Button>
            <Button onClick={() => setIsUpsertModalOpen(true)} startIcon={<EditIcon />}>Edit Card</Button>
          </ButtonGroup>
          <CardUpsertModal open={isUpsertModalOpen} card={currentCard} onClose={() => setIsUpsertModalOpen(false)} isEdit />
        </>
      }
    </Box >
  );
};

export default Study;