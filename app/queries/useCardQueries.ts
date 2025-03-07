'use client';
import useToast from '@/app/customHooks/useToast';
import { useAppSelector } from '@/redux/store';
import { Card } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import queryString from 'query-string';

const useCardQueries = (
	onSuccess: () => void = () => {},
	deckId?: string | string[]
	// cardIds?: string
) => {
	const currentStudyCardIds = useAppSelector(
		(state) => state.globalReducer.value.currentStudyCardIds
	);

	const toast = useToast();
	const queryClient = useQueryClient();

	const { data, isPending } = useQuery<Card[]>({
		queryKey: ['cards'],
		queryFn: async () => {
			const queryParams = queryString.stringify({
				dueForStudy: true,
				deckId: deckId,
			});
			const response = await fetch(`/api/cards/?${queryParams}`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}
			return await response.json();
		},
	});

	const {
		data: studyCardData,
		isPending: studyCardIsPending,
		mutate: studyCardFetch,
	} = useMutation({
		mutationFn: async (newCard: Card) => {
			const response = await fetch('api/cards/studyCards/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ cardIds: currentStudyCardIds }),
			});
			return response.json();
		},
		onSuccess: (response) => {
			toast('Successfully added a card.');
			queryClient.invalidateQueries();
			return response.json();
			onSuccess && onSuccess();
		},
		onError: (error: Error) => {
			toast(error.message);
		},
	});

	const { mutate: mutatePost, isPending: isPendingPost } = useMutation({
		mutationFn: async (newCard: Card) => {
			const response = await fetch('api/cards/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newCard),
			});
			return response.json();
		},
		onSuccess: () => {
			toast('Successfully added a card.');
			queryClient.invalidateQueries();
			onSuccess && onSuccess();
		},
		onError: (error: Error) => {
			toast(error.message);
		},
	});

	const { mutate: mutatePatch, isPending: isPendingPatch } = useMutation({
		mutationFn: async (updatedCard: Card) => {
			const response = await fetch(`/api/cards/${updatedCard!.id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updatedCard),
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}
			return await response.json();
		},
		onSuccess: () => {
			toast('Successfully edited card.');
			queryClient.invalidateQueries();
			onSuccess && onSuccess();
		},
		onError: (error: Error) => {
			toast(error.message);
		},
	});

	const { mutate: mutateDelete, isPending: isPendingDelete } = useMutation({
		mutationFn: async (cardId: number) => {
			const response = await fetch(`/api/cards/${cardId}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}
			return await response.json();
		},
		onSuccess: () => {
			toast('Successfully deleted card.');
			queryClient.invalidateQueries();
			onSuccess && onSuccess();
		},
		onError: (error: Error) => {
			toast(error.message);
		},
	});

	return {
		data,
		isPending,
		studyCardFetch,
		studyCardData,
		studyCardIsPending,
		mutatePost,
		isPendingPost,
		mutatePatch,
		isPendingPatch,
		mutateDelete,
		isPendingDelete,
	};
};

export default useCardQueries;
