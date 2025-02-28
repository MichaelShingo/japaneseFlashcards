import { ExtendedDeck } from "@/app/api/decks/route";
import { alpha, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';

interface EnhancedTableToolbarProps {
  numSelected: number;
  setSelected: Dispatch<SetStateAction<readonly number[]>>;
  selected: number[];
  data: ExtendedDeck[];
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;
  if (numSelected === 0) {
    return null;
  }

  let learnCount = 0;
  let reviewCount = 0;

  for (let deckId of props.selected) {
    const deck = props.data.find((deck) => deck.id === deckId);
    learnCount += deck.learnCount;
    reviewCount += deck.reviewCount;
  }

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.secondary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {`${numSelected} Deck Selected`}
          </Typography>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {`${learnCount} New Cards to Learn`}
          </Typography>
          <Typography
            sx={{ flex: '1 1 100%' }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {`${reviewCount} Reviews`}
          </Typography>
        </>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >

        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={() => props.setSelected([])}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default EnhancedTableToolbar;