import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { services } from '@/services';

import type { Booking } from '@/types/domain';

const queryKeys = {
  categories: ['catalog', 'categories'] as const,
  services: (categoryId?: string) => ['catalog', 'services', categoryId ?? 'all'] as const,
  professionals: (categoryId?: string) =>
    ['catalog', 'professionals', categoryId ?? 'all'] as const,
  availability: (professionalId: string) => ['availability', professionalId] as const,
  bookings: ['bookings'] as const,
  notifications: ['notifications'] as const,
  tracking: (id: string) => ['tracking', id] as const,
};

function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: services.catalog.getCategories,
    staleTime: 15 * 60_000,
  });
}

function useServices(categoryId?: string) {
  return useQuery({
    queryKey: queryKeys.services(categoryId),
    queryFn: () => services.catalog.getServices(categoryId),
    staleTime: 5 * 60_000,
  });
}

function useProfessionals(categoryId?: string) {
  return useQuery({
    queryKey: queryKeys.professionals(categoryId),
    queryFn: () => services.catalog.getProfessionals(categoryId),
    staleTime: 5 * 60_000,
  });
}

function useAvailability(professionalId?: string) {
  return useQuery({
    queryKey: queryKeys.availability(professionalId ?? ''),
    queryFn: () => services.catalog.getAvailability(professionalId!),
    enabled: Boolean(professionalId),
    staleTime: 60_000,
  });
}

function useBookings() {
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: services.bookings.getBookings,
    staleTime: 30_000,
  });
}

function useCreateBooking() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: services.bookings.createBooking,
    onSuccess: booking => {
      client.setQueryData<Booking[]>(queryKeys.bookings, currentBookings => [
        booking,
        ...(currentBookings ?? []),
      ]);
    },
  });
}

function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: services.notifications.getNotifications,
    staleTime: 60_000,
  });
}

function useTracking(id: string) {
  return useQuery({
    queryKey: queryKeys.tracking(id),
    queryFn: () => services.tracking.getSnapshot(id),
    refetchInterval: 3_000,
  });
}

export {
  queryKeys,
  useAvailability,
  useBookings,
  useCategories,
  useCreateBooking,
  useNotifications,
  useProfessionals,
  useServices,
  useTracking,
};
