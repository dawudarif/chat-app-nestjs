import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninDTO } from './dto/signIn-dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/create-user-dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(user: SigninDTO): Promise<{ accessToken: string }> {
    try {
      const findUser = await this.prismaService.user.findUnique({
        where: {
          email: user.email,
        },
      });

      const comparePassword = await bcrypt.compare(
        user.password,
        findUser.password,
      );

      if (comparePassword) {
        const payload = { email: findUser.email, sub: findUser.id } as any;

        return { accessToken: this.jwtService.sign(payload) };
      }
    } catch (error) {
      throw new UnauthorizedException('there was an error logging in');
    }
  }

  async createUser(userDto: CreateUserDTO): Promise<{ accessToken: string }> {
    const user = await this.userService.createUser(userDto);

    const payload = { email: user.email, sub: user.id } as any;
    return { accessToken: this.jwtService.sign(payload) };
  }
}
