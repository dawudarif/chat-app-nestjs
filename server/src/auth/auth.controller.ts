import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SigninDTO } from './dto/signIn-dto';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { CookieStrategy } from './auth.strategy';
import { CookieGuard } from './cookie.guard';

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
  @UseGuards(CookieGuard)
  async getProfile(@Req() req: Request) {
    console.log(req.user);

    return req.user;
  }
}
