import { Box, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect } from "react";

interface ResultPopover {
  isCorrect: boolean;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const ResultPopover = ({ isCorrect, visible, setVisible }) => {
  useEffect(() => {
    setTimeout(() => {
      if (visible) {
        setVisible(false);
      }
    }, 1000);
  }, [visible]);
  //APPPLY AND ANIMATIOJN....
  return (
    <Box
      className="absolute flex items-center justify-center top-0 left-0 h-screen w-screen bg-black/60 z-50 pointer-events-none transition-all"
    >
      <Typography
        className="uppercase text-center"
        color={isCorrect ? 'success' : 'error'}
        variant="h3"

      >
        {isCorrect ? 'Correct!' : 'Incorrect'}
      </Typography>
    </Box>
  );
};

export default ResultPopover;