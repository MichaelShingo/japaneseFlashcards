import { Evaluation, MUIColors } from './types';

export const EvaluationMessages: Record<Evaluation, string> = {
	correct: 'Correct!',
	close: 'Very close!',
	incorrect: 'Incorrect',
};

export const EvaluationColors: Record<Evaluation, MUIColors> = {
	correct: 'success',
	close: 'warning',
	incorrect: 'error',
};
