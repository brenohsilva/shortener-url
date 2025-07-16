import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { generateHash } from '../utils/generate-hash';
import { UserPresenter } from './user.presenter';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(UsersService.name);

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      if (!existingUser?.deletedAt) {
        this.logger.warn(
          `failed to create an user with the email ${existingUser.email}, User already exists`,
        );
        throw new ConflictException('User with this email already exists');
      } else if (existingUser?.deletedAt) {
        const restoredUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            deletedAt: null,
          },
        });
        this.logger.log(
          `User Restored successfully with the email ${restoredUser.email}`,
        );
        return new UserPresenter(restoredUser);
      }
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: generateHash(createUserDto.password),
      },
    });

    this.logger.log(`User Created successfully with the email ${user.email}`);
    return new UserPresenter(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
    });

    return users.map((url) => new UserPresenter(url));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserPresenter(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    this.logger.log(`Trying update an User with id ${id}`);
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      this.logger.warn(`failed to update an User, User does not exists`);
      throw new NotFoundException('User not found');
    }

    const newUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: updateUserDto.password
          ? generateHash(updateUserDto.password)
          : user.password,
      },
    });
    this.logger.log(
      `The user with the email ${newUser.email} was updated successfully `,
    );
    return new UserPresenter(newUser);
  }

  async remove(id: number) {
    this.logger.log(`Trying delete an user with id ${id}`);
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      this.logger.warn(`failed to delete an user, User does not exists`);
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    this.logger.log(
      `The user with the id ${user.id} was deleted successfully `,
    );
    return;
  }
}
