'use client';
import { Box } from "@mui/material";
import { useParams } from "next/navigation";

const Study = () => {
  const params = useParams();

  const { deckId } = params;
  console.log("🚀 ~ Study ~ deckId:", deckId);

  return (
    <Box>

    </Box>
  );
};

export default Study;