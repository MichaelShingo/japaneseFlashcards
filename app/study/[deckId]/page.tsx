'use client';
import { Box, Button, ButtonGroup, CircularProgress, TextField, Typography } from "@mui/material";
import { Card, Deck } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import queryString from "query-string";
import { useState } from "react";

const Study = () => {
  const params = useParams();
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>('');
  const { deckId } = params;

  const { data, isPending, isError } = useQuery<Card[]>({
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

  console.log("🚀 ~ Study ~ data:", data);

  // or should it just be, you know it or you don't 
  const selfRateOptions = [
    {
      value: 1,
      helpText: `Don't know at all.`
    },
    {
      value: 2,
      helpText: `Know a little.`
    },
    {
      value: 3,
      helpText: `Know well.`
    },
    {
      value: 4,
      helpText: `Know very well.`
    },
    {
      value: 5,
      helpText: `Know perfectly.`
    }
  ];


  const submitSelfRating = (rating: number) => {
    console.log(rating);
  };

  // const { deckData, deckIsPending } = useQuery<Deck>({
  //   queryKey: ['deck'],
  //   queryFn: async () => {
  //     const response = await fetch(`/api/decks/${deckId}`);
  //   }
  // });



  return (
    <Box className="flex items-center flex-col gap-6 justify-center w-full h-[100vh]">
      {isPending ?
        <CircularProgress />
        :
        <>
          <Typography variant="h1">
            {data[currentCardIndex].front}
          </Typography>
          <TextField className="w-[50vw] min-w-[300px] max-w-[800px] [&_.MuiInputBase-input]:text-center" variant="outlined" placeholder="Type english definition" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <ButtonGroup variant="contained" aria-label="Basic button group">
            {selfRateOptions.map((option) => (
              <Button size="large" onClick={() => submitSelfRating(option.value)} key={option.value}>{option.value}</Button>
            ))}
          </ButtonGroup>
        </>

      }

    </Box>
  );
};

export default Study;