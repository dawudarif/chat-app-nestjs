import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getUser', () => {
    it('should find a user by its id', async () => {
      const id = '1';
      const resolvedValue = {
        id: '1',
        username: 'johndoe',
        email: 'johndoe@example.com',
        name: 'John Doe',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(resolvedValue);

      const result = await userService.getUser(id);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
        },
      });

      expect(result).toEqual(resolvedValue);
    });

    it('should return a null user', async () => {
      const id = '1';

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await userService.getUser(id);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
        },
      });

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUser: CreateUserDTO = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        name: 'John Doe',
        password: 'password',
      };

      const hashedPassword = 'hashedpassword';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      mockPrismaService.user.create.mockResolvedValue(createUser);
      const user = await userService.createUser(createUser);

      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUser.email,
          name: createUser.name,
          username: createUser.username,
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          email: true,
          name: true,
        },
      });

      expect(user).toEqual(createUser);
    });

    it('should throw a ConflictException if the email already exists', async () => {
      const createUser: CreateUserDTO = {
        username: 'johndoe',
        email: 'existing@example.com',
        name: 'John Doe',
        password: 'password',
      };

      const hashedPassword = 'hashedpassword';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce({ email: createUser.email })
        .mockResolvedValueOnce(null);

      await expect(userService.createUser(createUser)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUser.email },
      });
    });

    it('should throw a ConflictException if the username already exists', async () => {
      const createUser: CreateUserDTO = {
        username: 'johndoe',
        email: 'existing@example.com',
        name: 'John Doe',
        password: 'password',
      };

      const hashedPassword = 'hashedpassword';

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

      mockPrismaService.user.findUnique
        .mockResolvedValueOnce({ username: createUser.username })
        .mockResolvedValueOnce(null);

      await expect(userService.createUser(createUser)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: createUser.username },
      });
    });
  });

  describe('search username', () => {
    it('should return users based on query', async () => {
      const query = 'john';
      const usernameNotInclude = 'johndoe';
      const resolvedValue = [
        {
          id: '1',
          username: 'johndoe',

          name: 'John Doe',
        },
        {
          id: '2',
          username: 'jane',

          name: 'Jane Doe',
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(resolvedValue);

      const result = await userService.findUsersByQuery(
        query,
        usernameNotInclude,
      );

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
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
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(resolvedValue);
    });

    it('should return empty array', async () => {
      const query = 'john';
      const usernameNotInclude = 'johndoe';

      mockPrismaService.user.findMany.mockResolvedValue([]);

      const result = await userService.findUsersByQuery(
        query,
        usernameNotInclude,
      );

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
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
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(2);
      expect(result).toEqual([]);
    });
  });
});
