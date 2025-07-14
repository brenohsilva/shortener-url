import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  const mockUsersService = {
    create: jest.fn().mockImplementation(
      (
        createUserDto: CreateUserDto = {
          name: 'John Doe',
          email: 'johndoe@gmail.com',
          password: 'password',
        },
      ) => {
        return {
          id: 1,
          name: createUserDto.name,
          email: createUserDto.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    ),
    findAll: jest.fn().mockImplementation(() => {
      return [];
    }),
    findOne: jest.fn().mockImplementation((id: number) => {
      return {
        id,
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }),

    update: jest
      .fn()
      .mockImplementation((id: number, updateUserDto: UpdateUserDto) => {
        return {
          id,
          name: updateUserDto.name || 'John Doe',
          email: 'johndoe@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const createUserDto = {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: 'password123',
    };

    expect(await controller.create(createUserDto)).toEqual({
      id: 1,
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should find all users', async () => {
    expect(await controller.findAll()).toEqual([]);
  });

  it('should find a user by id', async () => {
    expect(await controller.findOne('1')).toEqual({
      id: 1,
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should update a user', async () => {
    const updateUserDto = { name: 'Jane Doe' };
    expect(await controller.update('1', { name: updateUserDto.name })).toEqual({
      id: 1,
      name: 'Jane Doe',
      email: 'johndoe@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('should delete a user', async () => {
    expect(await controller.remove('1')).toBeUndefined();
    expect(mockUsersService.remove).toHaveBeenCalledWith(1);
  });
});
