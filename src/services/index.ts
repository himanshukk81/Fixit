import {
  mockAuthService,
  mockBookingService,
  mockCatalogService,
  mockNotificationService,
  mockTrackingService,
} from './mockServices';

// Mock implementations honor the same contracts as future Axios-backed services.
const services = {
  auth: mockAuthService,
  catalog: mockCatalogService,
  bookings: mockBookingService,
  notifications: mockNotificationService,
  tracking: mockTrackingService,
};

export { services };
