import { defaultAddress } from '@/mocks/data';
import { useBookingStore } from '@/store/booking.store';

describe('booking store', () => {
  beforeEach(() => {
    useBookingStore.getState().reset();
  });

  it('invalidates dependent selections when the service changes', () => {
    const store = useBookingStore.getState();
    store.chooseService('furniture-repair');
    store.chooseProfessional('pro-1');
    store.chooseSlot('2026-10-10', '09:00 AM');
    store.chooseAddress(defaultAddress);

    useBookingStore.getState().chooseService('door-repair');

    expect(useBookingStore.getState()).toMatchObject({
      serviceId: 'door-repair',
      professionalId: undefined,
      date: undefined,
      time: undefined,
      address: undefined,
    });
  });
});
