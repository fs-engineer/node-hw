import path from 'path';

const subscribe = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
};

const httpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNATHORIZED: 401,
  FORBIDDEN: 403,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const IMG_DIR = path.join(process.cwd(), 'public', 'images');
const TEMP_DIR = path.join(process.cwd(), 'tmp');
const PUBLIC_DIR = path.join(process.cwd() + 'public');

export { subscribe, httpCode, UPLOAD_DIR, IMG_DIR, TEMP_DIR, PUBLIC_DIR };
