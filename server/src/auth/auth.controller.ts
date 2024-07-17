import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SigninDTO } from './dto/signIn-dto';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('signin')
  signIn(@Body() data: SigninDTO) {
    // Perform Signin Logic here
    return { message: 'Signed In Successfully' };
  }

  @Post('signup')
  signup(@Body() data: CreateUserDTO) {
    // Perform Signup Logic here
    return { message: 'User Created Successfully' };
  }

  @Get('profile')
  async getProfile(@Param('id') id: string) {
    const getProfile = await this.userService.getUser(id);
    return getProfile;
  }
}
