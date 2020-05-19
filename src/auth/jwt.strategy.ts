import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import JwtPayloadInterface from './jwt-payload.interface';
import UserRepository from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './user.entity';
import * as config from 'config'

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || config.get<string>('jwt.secret')
    });
  }

  async validate(payload: JwtPayloadInterface): Promise<UserEntity> {
    const userEntity = await this.userRepository.findOne({username: payload.username})

    if (!userEntity) throw new UnauthorizedException()

    return userEntity
  }

}