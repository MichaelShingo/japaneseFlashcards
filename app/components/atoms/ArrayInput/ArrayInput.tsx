import { Box, Chip, IconButton, InputAdornment, Stack, TextField } from "@mui/material";
import { FC, KeyboardEvent, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { ControllerRenderProps } from "react-hook-form";
import { CardUpsertFormData } from "../../molecules/Modals/CardUpsertModal";

interface ArrayInputProps {
  label?: string;
  placeholder?: string;
  field: ControllerRenderProps<CardUpsertFormData, any>;
}

const ArrayInput: FC<ArrayInputProps> = ({ label, placeholder, field }) => {
  const [inputValue, setInputValue] = useState('');

  const handleDelete = (valueToDelete: string) => {
    const newValue = field.value.filter((value: string | number) => value !== valueToDelete);
    field.onChange(newValue);
  };

  const handleAdd = () => {
    const trimmedVal = inputValue.trim();
    if (trimmedVal !== '') {
      field.onChange([...field.value, trimmedVal]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box className="gap-3 flex-col flex">
      <TextField
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e: KeyboardEvent) => handleKeyDown(e)}
        placeholder={placeholder}
        label={label}
        fullWidth
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">
              <IconButton
                onClick={handleAdd}
                disabled={inputValue === ''}
                edge="end"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>,
          },
        }}
      />
      <Stack direction="row" rowGap={1} flexWrap={"wrap"} spacing={1}>
        {field.value.map((value) => (
          <Chip key={value} label={value} onDelete={() => handleDelete(value)} />
        ))}
      </Stack>
    </Box>
  );
};

export default ArrayInput;