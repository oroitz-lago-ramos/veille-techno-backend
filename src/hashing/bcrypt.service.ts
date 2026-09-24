import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService extends HashingService {

	// This value comes from the documentation : https://docs.nestjs.com/security/encryption-and-hashing
	private readonly saltRounds = 10;

	async hash(data: string): Promise<string> {
		return bcrypt.hash(data, this.saltRounds);
	}

	async compare(data: string, encrypted: string): Promise<boolean> {
		return bcrypt.compare(data, encrypted);
	}
}
