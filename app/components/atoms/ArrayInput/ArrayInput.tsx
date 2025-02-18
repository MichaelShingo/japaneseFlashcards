import { Box, Chip, IconButton, InputAdornment, Stack, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";
import AddIcon from '@mui/icons-material/Add';
import { ControllerRenderProps } from "react-hook-form";
import { CardUpsertFormData } from "../../molecules/Modals/CardUpsertModal";

interface ArrayInputProps {
  label?: string;
  placeholder?: string;
  field: ControllerRenderProps<CardUpsertFormData, "japaneseSynonyms">;
}

const ArrayInput: FC<ArrayInputProps> = ({ label, placeholder, field }) => {
  const handleDelete = () => {
    console.log('del');
  };

  return (
    <Box className="flex flex-row">
      <TextField
        {...field}
        placeholder={placeholder}
        label={label}
        fullWidth
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">

              <IconButton
                // onClick={handleClickShowPassword}
                // onMouseDown={handleMouseDownPassword}
                // onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>,
          },
        }}
      />
      <Stack direction="row" spacing={1}>
        {field.value.map((value) => (
          <Chip key={value} label={value} onDelete={handleDelete} />
        ))}
      </Stack>

    </Box>

  );
};

export default ArrayInput;