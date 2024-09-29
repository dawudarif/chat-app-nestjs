import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CookieGuard } from './guard/cookie.guard';
import { SigninDTO } from './dto/signIn-dto';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signin')
  async signIn(
    @Body() data: SigninDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const login = await this.authService.validateUser(data, response);

    return login;
  }

  @Post('signup')
  async signup(
    @Body() data: CreateUserDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const register = await this.authService.createUser(data, response);
    return register;
  }

  @Get('profile')
  @UseGuards(CookieGuard)
  async getProfile(@Req() req: Request) {
    return req.user;
  }
}
