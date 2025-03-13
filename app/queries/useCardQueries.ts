'use client';
import useToast from '@/app/customHooks/useToast';
import { Card } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CardUpsertFormData } from '../components/Modals/CardUpsertModal';

const useCardQuery = (queryParams?: string) => {
	const { data, isPending } = useQuery<Card[]>({
		queryKey: ['cards', queryParams],
		queryFn: async () => {
			const response = await fetch(`/api/cards/all/?${queryParams}`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message);
			}
			return await response.json();
		},
	});

	return {
		data,
		isPending,
	};
};

const useCardMutations = () => {
	const toast = useToast();
	const queryClient = useQueryClient();

	const {
		mutate: mutatePost,
		isPending: isPendingPost,
		isSuccess: isSuccessPost,
	} = useMutation({
		mutationFn: async (newCard: CardUpsertFormData & { deckId: string }) => {
			const response = await fetch('/api/cards/', {
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
		},
		onError: (error: Error) => {
			toast(error.message);
		},
	});

	const {
		mutate: mutatePatch,
		isPending: isPendingPatch,
		isSuccess: isSuccessPatch,
	} = useMutation({
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
		},
		onError: (error: Error) => {
			toast(error.message);
		},
	});

	return {
		mutatePost,
		isPendingPost,
		isSuccessPost,
		mutatePatch,
		isPendingPatch,
		isSuccessPatch,
		mutateDelete,
		isPendingDelete,
	};
};

export { useCardQuery, useCardMutations };
