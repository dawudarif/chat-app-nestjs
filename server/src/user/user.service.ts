import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async createUser(createUser: CreateUserDTO) {
    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(createUser.password, salt);

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
}
