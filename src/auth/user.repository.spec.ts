import UserRepository from './user.repository';
import { Test } from '@nestjs/testing';
import UserEntity from './user.entity';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt'

describe('UserRepository', () => {

  let userRepository: UserRepository

  beforeEach((async () => {

    const module = await Test.createTestingModule({
      providers: [
        UserRepository
      ]
    })
      .compile()

    userRepository = module.get<UserRepository>(UserRepository)

  }))

  describe('signUp', () => {

    let authCredentialsDto

    beforeEach(() => {

      authCredentialsDto = new AuthCredentialsDto()
      authCredentialsDto.username = 'test-username'
      authCredentialsDto.password = 'test-password'

    })

    it('should sign up successfully',  () => {


      const save = jest.fn()
      userRepository.create = jest.fn().mockReturnValue({save, username: ''})

      expect(userRepository.signUp(authCredentialsDto)).rejects.not.toThrow()
      //expect(create).toHaveBeenCalled()
      //expect(save).toHaveBeenCalled()
    });

    // it(`should throw ConflictException if error.code is "23505"`, () => {
    //
    //   const save = jest.fn().mockRejectedValue({code: '23505'})
    //   userRepository.create = jest.fn().mockRejectedValue({ save })
    //
    //   expect(userRepository.signUp(authCredentialsDto)).rejects.toThrow(ConflictException)
    // });

  })

  // describe('validateUserPassword', () => {})

})