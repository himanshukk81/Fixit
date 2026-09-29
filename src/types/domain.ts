type Id = string;

interface User {
  id: Id;
  name: string;
  phone: string;
  avatarUrl?: string;
}
interface Address {
  id: Id;
  label: string;
  line1: string;
  landmark?: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}
interface ServiceCategory {
  id: Id;
  name: string;
  description: string;
  icon: string;
  color: string;
}
interface Service {
  id: Id;
  categoryId: Id;
  name: string;
  description: string;
  durationMinutes: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
  popular?: boolean;
}
interface Review {
  id: Id;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}
interface AvailabilitySlot {
  id: Id;
  professionalId: Id;
  date: string;
  time: string;
  available: boolean;
}
interface Professional {
  id: Id;
  name: string;
  categoryIds: Id[];
  rating: number;
  reviewCount: number;
  completedBookings: number;
  experienceYears: number;
  distanceKm: number;
  hourlyRate: number;
  verified: boolean;
  skills: string[];
  bio: string;
  reviews: Review[];
}
type BookingStatus = 'upcoming' | 'on_the_way' | 'in_progress' | 'completed' | 'cancelled';
interface Booking {
  id: Id;
  serviceId: Id;
  professionalId: Id;
  address: Address;
  date: string;
  time: string;
  serviceCharge: number;
  additionalCharge: number;
  total: number;
  status: BookingStatus;
  createdAt: string;
}
interface Notification {
  id: Id;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: 'booking' | 'offer' | 'system';
}
interface TrackingSnapshot {
  bookingId: Id;
  latitude: number;
  longitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  etaMinutes: number;
  progress: number;
  status: BookingStatus;
  simulated: true;
}
interface ApiResponse<T> {
  data: T;
  message?: string;
}
interface AppError {
  code: string;
  message: string;
  status?: number;
  retryable: boolean;
}
interface BookingDraft {
  serviceId?: Id;
  professionalId?: Id;
  date?: string;
  time?: string;
  address?: Address;
}

export type {
  Address,
  ApiResponse,
  AppError,
  AvailabilitySlot,
  Booking,
  BookingDraft,
  BookingStatus,
  Id,
  Notification,
  Professional,
  Review,
  Service,
  ServiceCategory,
  TrackingSnapshot,
  User,
};
