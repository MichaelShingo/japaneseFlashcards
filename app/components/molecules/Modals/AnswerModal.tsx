import { Box, Button, Dialog, DialogActions, DialogContent, List, ListItem, ListItemText, Typography } from "@mui/material";
import { Card } from "@prisma/client";
import { FC, } from "react";
import { monthDayYearTime12 } from "@/app/utils/formatDate";

interface AnswerModalProps {
  open: boolean;
  onClose: () => void;
  card: Card;
}

const AnswerModal: FC<AnswerModalProps> = ({ open, onClose, card, }) => {
  const content = [
    {
      title: 'Other Acceptable Answers',
      info: card.englishSynonyms.length > 0 ? card.englishSynonyms.join(' | ') : 'No synonyms available.'
    },
    {
      title: 'Mneumonic',
      info: card.hint
    },
    {
      title: 'Study Level',
      info: card.srsLevel
    },
    {
      title: 'Due for Study',
      info: monthDayYearTime12(card.nextStudy)
    },
    {
      title: 'Created At',
      info: monthDayYearTime12(card.createdAt)
    },
    {
      title: 'Updated At',
      info: monthDayYearTime12(card.updatedAt)
    },
  ];

  return (
    <Dialog
      open={open}
      maxWidth='xs'
      fullWidth
    >
      <DialogContent>
        <Box className="flex flex-col gp-7 mt-2">
          <Typography textAlign="center" variant="h2">
            {card.english}
          </Typography>
          <List className="items-center flex flex-col justify-center text-center">
            {content.map((item) => (
              <ListItem key={item.title}>
                <ListItemText
                  className="text-center"
                  primary={item.title}
                  secondary={item.info}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog >
  );
};

export default AnswerModal;