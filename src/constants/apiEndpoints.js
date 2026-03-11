export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  ME: '/auth/me',
};

export const PET_ENDPOINTS = {
  GET_ALL: '/posts',
  GET_BY_ID: (id) => `/posts/${id}`,
  CREATE: '/posts',
  UPDATE: (id) => `/posts/${id}`,
  DELETE: (id) => `/posts/${id}`,
  SEARCH: '/posts',
  MY_REPORTS: '/posts/my-posts',
  UPLOAD_IMAGE: '/posts/upload-image',
};

/**
 * User related endpoints
 */
export const USER_ENDPOINTS = {
  GET_PROFILE: '/users/profile/me',
  UPDATE_PROFILE: '/users/profile/me',
  GET_MY_PETS: '/posts/my-posts',
};

/**
 * Location/Geolocation related endpoints
 */
export const LOCATION_ENDPOINTS = {
  NEARBY_PETS: '/location/nearby',
  GEOCODE: '/location/geocode',
  REVERSE_GEOCODE: '/location/reverse-geocode',
};
