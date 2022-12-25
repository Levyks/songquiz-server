import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);

export interface RandomService {
  generateNumericString: (length: number) => string;
  generateSecureBase64String: (length: number) => Promise<string>;
}

export class RandomServiceImpl implements RandomService {
  generateNumericString(length: number) {
    const chars = '0123456789';
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  generateSecureBase64String(length: number) {
    return randomBytes(length).then((buffer) => buffer.toString('base64'));
  }
}
