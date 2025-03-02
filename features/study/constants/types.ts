export type StudyFormData = {
	answer: string;
};

export type Evaluation = 'correct' | 'incorrect' | 'close' | null;

export type MUIColors = 'success' | 'warning' | 'error';

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
