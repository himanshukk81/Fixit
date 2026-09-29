import { create } from 'zustand';

import type { Address, BookingDraft } from '@/types/domain';

interface BookingState extends BookingDraft {
  chooseService(id: string): void;
  chooseProfessional(id: string): void;
  chooseSlot(date: string, time: string): void;
  chooseAddress(address: Address): void;
  reset(): void;
}

const empty: BookingDraft = {};
const useBookingStore = create<BookingState>(set => ({
  ...empty,
  chooseService: serviceId =>
    set({
      serviceId,
      professionalId: undefined,
      date: undefined,
      time: undefined,
      address: undefined,
    }),
  chooseProfessional: professionalId => set({ professionalId, date: undefined, time: undefined }),
  chooseSlot: (date, time) => set({ date, time }),
  chooseAddress: address => set({ address }),
  reset: () => set(empty),
}));

export { useBookingStore };
