import type {
  Address,
  AvailabilitySlot,
  Booking,
  Notification,
  Professional,
  Service,
  ServiceCategory,
  TrackingSnapshot,
  User,
} from '@/types/domain';

interface AuthService {
  requestOtp(phone: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<{ token: string; user: User }>;
}
interface CatalogService {
  getCategories(): Promise<ServiceCategory[]>;
  getServices(categoryId?: string): Promise<Service[]>;
  getProfessionals(categoryId?: string): Promise<Professional[]>;
  getAvailability(professionalId: string): Promise<AvailabilitySlot[]>;
}
interface CreateBookingInput {
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  address: Address;
}
interface BookingService {
  getBookings(): Promise<Booking[]>;
  createBooking(input: CreateBookingInput): Promise<Booking>;
}
interface NotificationService {
  getNotifications(): Promise<Notification[]>;
}
interface TrackingService {
  getSnapshot(bookingId: string): Promise<TrackingSnapshot>;
}

export type {
  AuthService,
  BookingService,
  CatalogService,
  CreateBookingInput,
  NotificationService,
  TrackingService,
};
