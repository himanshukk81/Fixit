import {
  categories,
  defaultAddress,
  initialBookings,
  notifications,
  professionals,
  services,
} from '@/mocks/data';
import { makeBookingId } from '@/utils/format';

import type {
  AuthService,
  BookingService,
  CatalogService,
  NotificationService,
  TrackingService,
} from '@/services/contracts';
import type { Booking } from '@/types/domain';

const wait = (ms = 350) => new Promise(resolve => setTimeout(resolve, ms));
const bookingDb = [...initialBookings];

const mockAuthService: AuthService = {
  async requestOtp() {
    await wait(500);
  },
  async verifyOtp(phone, _otp) {
    await wait(600);
    return {
      token: `mock-${Date.now()}`,
      user: { id: 'user-1', name: 'Priya', phone: `+91 ${phone}` },
    };
  },
};

const mockCatalogService: CatalogService = {
  async getCategories() {
    await wait();
    return categories;
  },
  async getServices(categoryId) {
    await wait();
    return categoryId ? services.filter(item => item.categoryId === categoryId) : services;
  },
  async getProfessionals(categoryId) {
    await wait();
    return categoryId
      ? professionals.filter(item => item.categoryIds.includes(categoryId))
      : professionals;
  },
  async getAvailability(professionalId) {
    await wait(250);
    const dates = Array.from({ length: 5 }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() + index + 1);
      return day.toISOString().slice(0, 10);
    });
    return dates.flatMap((date, dayIndex) =>
      ['09:00 AM', '11:30 AM', '02:00 PM', '05:00 PM'].map((time, index) => ({
        id: `${professionalId}-${date}-${index}`,
        professionalId,
        date,
        time,
        available: !(dayIndex === 0 && index === 1),
      })),
    );
  },
};

const mockBookingService: BookingService = {
  async getBookings() {
    await wait();
    return [...bookingDb];
  },
  async createBooking(input) {
    await wait(700);
    const service = services.find(item => item.id === input.serviceId);
    const booking: Booking = {
      id: makeBookingId(),
      ...input,
      address: input.address ?? defaultAddress,
      serviceCharge: service?.basePrice ?? 0,
      additionalCharge: 49,
      total: (service?.basePrice ?? 0) + 49,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
    };
    bookingDb.unshift(booking);
    return booking;
  },
};

const mockNotificationService: NotificationService = {
  async getNotifications() {
    await wait();
    return notifications;
  },
};
let progress = 0.24;
const mockTrackingService: TrackingService = {
  async getSnapshot(bookingId) {
    await wait(150);
    progress = Math.min(0.92, progress + 0.035);
    return {
      bookingId,
      latitude: 12.972 + progress * 0.0064,
      longitude: 77.635 + progress * 0.0058,
      destinationLatitude: 12.9784,
      destinationLongitude: 77.6408,
      etaMinutes: Math.max(3, Math.round(18 * (1 - progress))),
      progress,
      status: 'on_the_way',
      simulated: true,
    };
  },
};

export {
  mockAuthService,
  mockBookingService,
  mockCatalogService,
  mockNotificationService,
  mockTrackingService,
};
