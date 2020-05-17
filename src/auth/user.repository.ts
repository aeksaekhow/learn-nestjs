import { EntityRepository, Repository } from 'typeorm';
import UserEntity from './user.entity';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(UserEntity)
export default class UserRepository extends Repository<UserEntity> {

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {

    const salt = await bcrypt.genSalt()

    const userEntity = this.create()
    userEntity.username = authCredentialsDto.username
    userEntity.password = await bcrypt.hash(authCredentialsDto.password, salt)
    userEntity.salt = salt

    try {
      await userEntity.save()
    }
    catch (error) {
      if (error.code === '23505') throw new ConflictException(`Username '${userEntity.username}' already exists`)
      throw new InternalServerErrorException()
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<UserEntity> {
    const userEntity = await this.findOne({username: authCredentialsDto.username})

    if (userEntity && await userEntity.validatePassword(authCredentialsDto.password)) {
      return userEntity
    }
    return null
  }

}