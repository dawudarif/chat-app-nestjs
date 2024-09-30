import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUser: CreateUserDTO) {
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(createUser.password, salt);

    const checkEmail = await this.prismaService.user.findUnique({
      where: {
        email: createUser.email,
      },
    });

    if (checkEmail?.email) {
      throw new ConflictException('Email already exists');
    }

    const checkUsername = await this.prismaService.user.findUnique({
      where: {
        username: createUser.username,
      },
    });

    if (checkUsername) {
      throw new ConflictException('Username already exists');
    }

    const createNewUser = await this.prismaService.user.create({
      data: {
        email: createUser.email,
        name: createUser.name,
        username: createUser.username,
        password: hashPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });

    if (createNewUser) {
      return createNewUser;
    } else {
      throw new BadRequestException('Internal server error');
    }
  }

  async getUser(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
      },
    });

    return user;
  }

  async findUsersByQuery(query: string, usernameNotInclude: string) {
    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: query as string,
          not: usernameNotInclude,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
      },
    });

    return users;
  }
}
