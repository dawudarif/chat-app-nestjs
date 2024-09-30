import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { SigninDTO } from './dto/signIn-dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockJwtToken'),
  };

  const mockResponse = () => {
    return {
      cookie: jest.fn(),
    } as unknown as Response;
  };
  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            getUserWithAllData: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('development'),
          },
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('signUp', () => {
    it('should create a user, sign a JWT, and set it as a cookie', async () => {
      const userDto: CreateUserDTO = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password',
        name: 'John Doe',
      };

      const createUserResponse = {
        id: '1',
        username: 'johndoe',
        email: 'johndoe@example.com',
        name: 'John Doe',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

      (userService.createUser as jest.Mock).mockResolvedValue(
        createUserResponse,
      );

      const response = mockResponse();

      const result = await authService.createUser(userDto, response);

      expect(userService.createUser).toHaveBeenCalledWith(userDto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: createUserResponse.email,
        name: createUserResponse.name,
        sub: createUserResponse.id,
      });

      expect(response.cookie).toHaveBeenCalledWith(
        'jwt',
        'mockJwtToken',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          expires: expect.any(Date),
        }),
      );

      expect(result).toEqual({ accessToken: 'mockJwtToken' });
    });

    it('should throw an error if the email already exists', async () => {
      const userDto: CreateUserDTO = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password',
        name: 'John Doe',
      };

      (userService.createUser as jest.Mock).mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      const response = mockResponse();

      await expect(authService.createUser(userDto, response)).rejects.toThrow(
        'Email already exists',
      );

      expect(response.cookie).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should authenticate the user, validate password and generate a token', async () => {
      const res = mockResponse();

      const data: SigninDTO = {
        email: 'john@example.com',
        password: 'password',
      };

      const findUniqueResponse = {
        id: '1',
        name: 'John',
        email: 'john@example.com',
        username: 'john',
        password: 'hashedPassword',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      (userService.getUserWithAllData as jest.Mock).mockResolvedValue(
        findUniqueResponse,
      );

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await authService.validateUser(data, res);

      expect(userService.getUserWithAllData).toHaveBeenCalledTimes(1);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: findUniqueResponse.email,
        name: findUniqueResponse.name,
        sub: findUniqueResponse.id,
      });

      expect(res.cookie).toHaveBeenCalledWith(
        'jwt',
        'mockJwtToken',
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          expires: expect.any(Date),
        }),
      );
    });
  });
});
