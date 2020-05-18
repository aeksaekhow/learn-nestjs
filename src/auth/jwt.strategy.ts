import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import JwtPayloadInterface from './jwt-payload.interface';
import UserRepository from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './user.entity';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret51'
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({username: payload.username})

    if (!userEntity) throw new UnauthorizedException()

    return userEntity
  }

}