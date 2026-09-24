
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { HashingService } from '../hashing/hashing.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private hashingService: HashingService,
		private jwtService: JwtService
	) { }

	async signIn(email: string, pass: string): Promise<{access_token: string}> {
		const user = await this.usersService.findOneByEmailWithPassword(email);
		if (!user) { throw new UnauthorizedException()}
		const passwordMatches = await this.hashingService.compare(pass, user.password);
		if (!passwordMatches) {throw new UnauthorizedException()}
		
		const payload = { sub: user.id, name: user.name, email: user.email };
		return {
      	// 💡 Here the JWT secret key that's used for signing the payload 
      	// is the key that was passed in the JwtModule
      		access_token: await this.jwtService.signAsync(payload),
    	};
	}
}
