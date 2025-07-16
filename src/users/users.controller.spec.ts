/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const now = new Date();
  const createUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'password',
  };
  const mockUsersService = {
    create: jest.fn().mockImplementation((createUserDto: CreateUserDto) => {
      return {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        createdAt: now,
        updatedAt: now,
      };
    }),
    findAll: jest.fn().mockImplementation(() => {
      return [
        {
          id: 1,
          name: createUserDto.name,
          email: createUserDto.email,
          createdAt: now,
          updatedAt: now,
        },
      ];
    }),
    findOne: jest.fn().mockImplementation((id: number) => {
      return {
        id,
        name: createUserDto.name,
        email: createUserDto.email,
        createdAt: now,
        updatedAt: now,
      };
    }),
    update: jest
      .fn()
      .mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
        return {
          id,
          name: updateUserDto.name,
          email: createUserDto.email,
          createdAt: now,
          updatedAt: now,
        };
      }),
    remove: jest.fn().mockImplementation((id: number) => {
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    expect(await controller.create(createUserDto)).toEqual({
      id: 1,
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: now,
      updatedAt: now,
    });
  });

  it('should find all users', async () => {
    expect(await controller.findAll()).toEqual([
      {
        id: 1,
        name: createUserDto.name,
        email: createUserDto.email,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });

  it('should find a user by id', async () => {
    expect(await controller.findOne('1')).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      createdAt: now,
      updatedAt: now,
    });
  });

  it('should update a user', async () => {
    const updateUserDto = { name: 'Jane Doe' };
    expect(await controller.update('1', { name: updateUserDto.name })).toEqual({
      id: 1,
      name: 'Jane Doe',
      email: 'johndoe@gmail.com',
      createdAt: now,
      updatedAt: now,
    });
  });

  it('should delete a user', async () => {
    expect(await controller.remove('1')).toBeUndefined();
  });
});
