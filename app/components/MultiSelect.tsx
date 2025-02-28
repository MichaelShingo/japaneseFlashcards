import { ValueLabel } from '@/app/utils/common';
import {
	Checkbox,
	ListItemText,
	MenuItem,
	Select,
	SelectChangeEvent,
} from '@mui/material';
import { FC } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

interface MultiSelectProps {
	values: string[];
	options: ValueLabel[];
	onChange: (e: SelectChangeEvent<string[] | number[]>) => void;
}

const MultiSelect: FC<MultiSelectProps> = ({ values, options, onChange }) => {
	const renderValue = (selected: string[] | number[]) => {
		const labels = selected.map((value: string | number) => {
			const option = options.find((option) => option.value === value);
			return option ? option.label : '';
		});
		return labels.length > 0 ? labels.join(', ') : [];
	};

	return (
		<>
			{/* <InputLabel id="label">Filter</InputLabel> */}
			<Select
				className="w-1/4"
				multiple
				variant="filled"
				value={values}
				onChange={onChange}
				MenuProps={MenuProps}
				renderValue={(selected) => renderValue(selected)}
			>
				{options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						<Checkbox checked={values.includes(option.value)} />
						<ListItemText primary={option.label} />
					</MenuItem>
				))}
			</Select>
		</>
	);
};

export default MultiSelect;
