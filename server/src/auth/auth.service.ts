import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDTO } from './dto/signIn-dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    user: SigninDTO,
    response: Response,
  ): Promise<{ accessToken: string }> {
    try {
      const findUser = await this.userService.getUserWithAllData(user.email);

      const comparePassword = await bcrypt.compare(
        user.password,
        findUser.password,
      );

      if (comparePassword) {
        const payload = {
          email: findUser.email,
          name: findUser.name,
          sub: findUser.id,
        } as any;

        const accessToken = this.jwtService.sign(payload);

        response.cookie('jwt', accessToken, {
          httpOnly: true,
          secure: this.configService.get('NODE_ENV ') === 'production',
          sameSite: 'strict',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        return { accessToken };
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid Credentials');
    }
  }

  async createUser(
    userDto: CreateUserDTO,
    response: Response,
  ): Promise<{ accessToken: string }> {
    const user = await this.userService.createUser(userDto);

    const payload = { email: user.email, name: user.name, sub: user.id } as any;
    const accessToken = this.jwtService.sign(payload);

    response.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV ') === 'production',
      sameSite: 'strict',
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return { accessToken };
  }
}
