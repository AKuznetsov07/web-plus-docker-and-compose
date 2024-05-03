import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HashService {
  constructor() {}

  async hashData(data: string) {
    return await bcrypt.hash(data, 1);
  }
  async verifyHash(data: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}
