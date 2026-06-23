// ---- Auth Endpoints ----

export const AUTH_ENDPOINTS = {
  SIGN_IN: '/auth/sign-in',
  SIGN_IN_RESEND_MFA: '/auth/sign-in/resend',
  SIGN_IN_VERIFY_MFA: '/auth/sign-in/verify',
  SIGN_UP: '/auth/sign-up',

  MFA_DISABLE: '/auth/mfa/disable',
  MFA_SETUP: '/auth/mfa/setup',
  MFA_RESEND: '/auth/mfa/resend',
  MFA_VERIFY: '/auth/mfa/verify',

  LOGOUT: '/auth/logout',

  REFRESH: '/auth/refresh',

  CHANGE_PASSWORD: '/auth/change-password',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  ME: '/auth/me',
} as const;
