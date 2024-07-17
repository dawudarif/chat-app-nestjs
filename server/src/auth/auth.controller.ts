import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SigninDTO } from './dto/signIn-dto';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signin')
  async signIn(@Body() data: SigninDTO): Promise<{ accessToken: string }> {
    const login = await this.authService.validateUser(data);
    return login;
  }

  @Post('signup')
  async signup(@Body() data: CreateUserDTO): Promise<{ accessToken: string }> {
    const register = await this.authService.createUser(data);
    return register;
  }

  @Get('profile')
  async getProfile(@Param('id') id: string) {
    const getProfile = await this.userService.getUser(id);
    return getProfile;
  }
}
