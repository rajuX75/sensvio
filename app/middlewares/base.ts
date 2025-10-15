import { os } from '@orpc/server';

export const base = os.$context<{ request: Request }>().errors({
  RATE_LIMITED: {
    message: "You've exceeded the request limit. Please slow down and try again later.",
  },
  BAD_REQUEST: {
    message:
      'The request body or parameters were invalid. Check the documentation for required fields.',
  },
  NOT_FOUND: {
    message: 'The requested resource could not be found. Check the ID or path and try again.',
  },
  FORBIDDEN: {
    message: 'You do not have permission to access or modify this resource.',
  },
  UNAUTHORIZED: {
    message:
      'Authentication failed. Please check your credentials (token/API key) or log in again.',
  },
});
