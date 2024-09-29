import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let userService: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
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
});
