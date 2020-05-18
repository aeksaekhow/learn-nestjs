import { Body, Controller, Inject, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import AuthCredentialsDto from './dto/auth-credentials.dto';
import AuthSigninResponseDto from './dto/auth-signin-response.dto';
import UserEntity from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import GetUser from './get-user.decorator';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<void> {
    await this.authService.signUp(authCredentialsDto)
  }

  @Post('signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<AuthSigninResponseDto> {
    const authSigninResponseDto = await this.authService.signIn(authCredentialsDto)
    return authSigninResponseDto
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() userEntity: UserEntity) {
    console.log('User', userEntity)
  }

}
