import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { CreateUserDTO } from '../user/dto/create-user-dto';
import { SigninDTO } from './dto/signIn-dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockResponse = () => {
    const res: Partial<Response> = {};
    return res as Response;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUser: jest.fn(),
            validateUser: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user and return an access token with a response', async () => {
    const res = mockResponse();
    const createUserDto: CreateUserDTO = {
      email: 'test@example.com',
      password: 'securepassword',
      name: 'John Doe',
      username: 'johndoe',
    };
    const expectedResult = {
      accessToken: 'some_token',
    };

    (authService.createUser as jest.Mock).mockResolvedValue(expectedResult);
    const result = await controller.signup(createUserDto, res);
    expect(authService.createUser).toHaveBeenCalledWith(createUserDto, res);
    expect(result).toEqual(expectedResult);
  });

  it('should validate a user and return an access token with a response', async () => {
    const SigninDto: SigninDTO = {
      email: 'test@example.com',
      password: 'securepassword',
    };
    const expectedResult = {
      accessToken: 'some_token',
    };

    (authService.validateUser as jest.Mock).mockResolvedValue(expectedResult);
    const res = mockResponse();
    const result = await controller.signIn(SigninDto, res);
    expect(authService.validateUser).toHaveBeenCalledWith(SigninDto, res);
    expect(result).toEqual(expectedResult);
  });
});
