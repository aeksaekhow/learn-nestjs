import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import UserRepository from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import JwtPayloadInterface from './jwt-payload.interface';
import AuthSigninResponseDto from './dto/auth-signin-response.dto';

@Injectable()
export class AuthService {

  private logger = new Logger('AuthService')

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.userRepository.signUp(authCredentialsDto)
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<AuthSigninResponseDto> {
    const userEntity = await this.userRepository.validateUserPassword(authCredentialsDto)

    if (!userEntity) throw new UnauthorizedException(`Invalid credentials`)

    const payload: JwtPayloadInterface = {
      username: userEntity.username
    }
    const accessToken = this.jwtService.sign(payload)
    this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)

    return {
      accessToken
    }
  }

}
