import useToast from '@/app/customHooks/useToast';
import { Card } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';
import { ExtendedDeck } from '../study/[deckId]/page';

const useDeckQueries = (onSuccess?: () => void, deckId?: string | string[]) => {
	const toast = useToast();
	const queryClient = useQueryClient();

	const { data, isPending } = useQuery<ExtendedDeck>({
		queryKey: ['deck'],
		queryFn: async () => {
			const response = await fetch(`/api/decks/${deckId}`, {
				method: 'GET',
			});
			if (!response.ok) {
				throw new Error('Failed to fetch.');
			}
			return response.json();
		},
	});

	// const { mutate: mutatePost, isPending: isPendingPost } = useMutation({
	// 	mutationFn: async (newCard: Card) => {
	// 		const response = await fetch('api/cards/', {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify(newCard),
	// 		});
	// 		return response.json();
	// 	},
	// 	onSuccess: () => {
	// 		toast('Successfully added a card.');
	// 		queryClient.invalidateQueries();
	// 		onSuccess();
	// 	},
	// 	onError: (error: Error) => {
	// 		toast(error.message);
	// 	},
	// });

	// const { mutate: mutatePatch, isPending: isPendingPatch } = useMutation({
	// 	mutationFn: async (updatedCard: Card) => {
	// 		const response = await fetch(`/api/cards/${updatedCard!.id}`, {
	// 			method: 'PATCH',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 			body: JSON.stringify(updatedCard),
	// 		});
	// 		if (!response.ok) {
	// 			const error = await response.json();
	// 			throw new Error(error.message);
	// 		}
	// 		return await response.json();
	// 	},
	// 	onSuccess: () => {
	// 		toast('Successfully edited card.');
	// 		queryClient.invalidateQueries();
	// 		onSuccess();
	// 	},
	// 	onError: (error: Error) => {
	// 		toast(error.message);
	// 	},
	// });

	// const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
	// 	mutationFn: async (cardId: number) => {
	// 		const response = await fetch(`/api/cards/${cardId}`, {
	// 			method: 'DELETE',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 			},
	// 		});
	// 		if (!response.ok) {
	// 			const error = await response.json();
	// 			throw new Error(error.message);
	// 		}
	// 		return await response.json();
	// 	},
	// 	onSuccess: () => {
	// 		toast('Successfully deleted card.');
	// 		queryClient.invalidateQueries();
	// 		onSuccess();
	// 	},
	// 	onError: (error: Error) => {
	// 		toast(error.message);
	// 	},
	// });

	return {
		data,
		isPending,
		// mutatePost,
		// isPendingPost,
		// mutatePatch,
		// isPendingPatch,
		// mutateDelete,
		// isPendingDelete,
	};
};

export default useDeckQueries;
