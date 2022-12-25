import { faker } from '@faker-js/faker';
import { RandomService } from '@/services/random.service';

faker.seed(42);

export class RandomServiceTestImpl implements RandomService {
  generateNumericString(length: number) {
    return faker.random.numeric(length);
  }
  generateSecureBase64String(length: number) {
    return Promise.resolve(faker.random.alphaNumeric(length));
  }
}
