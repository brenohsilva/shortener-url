/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserPresenter } from './user.presenter';

jest.mock('./user.presenter');

describe('UsersService', () => {
  let service: UsersService;

  const now = new Date();
  const baseUser = {
    id: 1,
    name: 'John Doe',
    email: 'johndoe@hotmail.com',
    password: 'hashed_password',
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };

  const mockPrismaService = {
    user: {
      create: jest.fn().mockResolvedValue({
        id: baseUser.id,
        name: baseUser.name,
        email: baseUser.email,
        createdAt: baseUser.createdAt,
        updatedAt: baseUser.updatedAt,
      }),
      findFirst: jest.fn(),
      update: jest.fn().mockResolvedValue({
        id: baseUser.id,
        name: baseUser.name,
        email: baseUser.email,
        createdAt: baseUser.createdAt,
        updatedAt: baseUser.updatedAt,
      }),
      findMany: jest.fn().mockResolvedValue([]),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user if not exists', async () => {
    const createUserDto: CreateUserDto = {
      name: baseUser.name,
      email: baseUser.email,
      password: '123456',
    };
    (UserPresenter as jest.Mock).mockImplementation((user): any => user);
    mockPrismaService.user.findFirst.mockResolvedValue(null);
    expect(await service.create(createUserDto)).toEqual({
      id: 1,
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: now,
      updatedAt: now,
    });
  });

  it('should throw if user already exists and not deleted', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({
      ...baseUser,
      deletedAt: null,
    });

    const dto: CreateUserDto = {
      name: baseUser.name,
      email: baseUser.email,
      password: '123456',
    };

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('should reactivate soft-deleted user', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({
      ...baseUser,
      deletedAt: new Date(),
    });

    const dto: CreateUserDto = {
      name: baseUser.name,
      email: baseUser.email,
      password: '123456',
    };

    await service.create(dto);

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: baseUser.id },
      data: { deletedAt: null },
    });
  });

  it('should find all users', async () => {
    await service.findAll();
    expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('should find one user by id', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({
      id: baseUser.id,
      name: baseUser.name,
      email: baseUser.email,
      createdAt: baseUser.createdAt,
      updatedAt: baseUser.updatedAt,
    });

    (UserPresenter as jest.Mock).mockImplementation((user): any => user);

    expect(await service.findOne(1)).toEqual({
      id: baseUser.id,
      name: baseUser.name,
      email: baseUser.email,
      createdAt: baseUser.createdAt,
      updatedAt: baseUser.updatedAt,
    });
  });

  it('should update a user', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({
      id: 1,
      password: 'old_hash',
    });

    mockPrismaService.user.update.mockResolvedValue({
      id: 1,
      name: 'Jane Doe',
      email: baseUser.email,
      createdAt: baseUser.createdAt,
      updatedAt: expect.any(Date),
    });

    const dto: UpdateUserDto = {
      name: 'Jane Doe',
      password: 'new_password',
    };
    (UserPresenter as jest.Mock).mockImplementation((user): any => user);

    expect(await service.update(1, dto)).toEqual({
      id: 1,
      name: dto.name,
      email: baseUser.email,
      createdAt: baseUser.createdAt,
      updatedAt: baseUser.updatedAt,
    });
    expect(UserPresenter).toHaveBeenCalled();
  });

  it('should throw if user to update is not found', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(null);

    const dto: UpdateUserDto = { name: 'Any' };

    await expect(service.update(1, dto)).rejects.toThrow(NotFoundException);
  });

  it('should soft delete a user', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue({
      id: 1,
      password: 'hash',
    });

    await service.remove(1);

    expect(mockPrismaService.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { deletedAt: new Date() },
    });
  });

  it('should throw if user to delete not found', async () => {
    mockPrismaService.user.findFirst.mockResolvedValue(null);

    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });
});
