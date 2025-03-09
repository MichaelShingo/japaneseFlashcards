import { musicCards } from './musicCards';

const japaneseFieldValues = musicCards.map((card) => card.japanese);
const duplicates = japaneseFieldValues.filter(
	(value, index, self) => self.indexOf(value) !== index
);

console.log('Duplicate japanese field values:', duplicates);
