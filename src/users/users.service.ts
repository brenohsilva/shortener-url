import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
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
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      if (!existingUser?.deletedAt) {
        throw new ConflictException('User with this email already exists');
      } else if (existingUser?.deletedAt) {
        const restoredUser = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            deletedAt: null,
          },
        });
        return new UserPresenter(restoredUser);
      }
    }

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: generateHash(createUserDto.password),
      },
    });

    return new UserPresenter(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (UsersService.length === 0) {
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }

    return users;
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
      throw new NotFoundException('User not found');
    }

    const new_user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        password: updateUserDto.password
          ? generateHash(updateUserDto.password)
          : user.password,
      },
    });

    return new UserPresenter(new_user);
  }

  async remove(id: number) {
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
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return;
  }
}
