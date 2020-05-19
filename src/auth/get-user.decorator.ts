import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserEntity from './user.entity';

const GetUser = createParamDecorator((data, input): UserEntity => {
  const ctx = input as ExecutionContext
  console.log(ctx.switchToHttp().getRequest().url)
  const req = ctx.switchToHttp().getRequest()
  return req.user
})

export default GetUser