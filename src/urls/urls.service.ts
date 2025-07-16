/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { PrismaService } from '../prisma.service';
import { generateUniqueCode } from '../utils/generate-unique-code';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlPresenter } from './url.presenter';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async create(createUrlDto: CreateUrlDto, user: any) {
    const userId = user?.id ?? null;
    const baseUrl = process.env.BASE_URL;

    const id = crypto.randomUUID();
    const shortCode = generateUniqueCode(id);
    const shortUrl = `${baseUrl}/${shortCode}`;

    const newUrl = await this.prisma.url.create({
      data: {
        id,
        userId,
        originalUrl: createUrlDto.original_url,
        shortCode,
        shortUrl,
        expiresAt: userId ? null : new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    return {
      short_url: newUrl.shortUrl,
    };
  }

  async redirect(short_code: string) {
    const now = new Date();

    return await this.prisma.$transaction(async (tx) => {
      const originalUrl = await tx.url.findFirst({
        where: {
          shortCode: short_code,
          deletedAt: null,
          OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
        },
        select: {
          id: true,
          originalUrl: true,
        },
      });

      if (!originalUrl) {
        throw new NotFoundException('URL not found or expired');
      }

      await tx.url.update({
        where: { id: originalUrl.id },
        data: {
          clicks: {
            increment: 1,
          },
        },
      });

      return { url: originalUrl.originalUrl };
    });
  }

  async findAll(user: any) {
    const userId = user?.id ?? null;

    const urls = await this.prisma.url.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return urls.map((url) => new UrlPresenter(url));
  }

  async findOne(id: string, user: any) {
    const userId = user?.id;

    const url = await this.prisma.url.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return new UrlPresenter(url);
  }

  async update(id: string, updateUrlDto: UpdateUrlDto, user: any) {
    const userId = user?.id;

    const url = await this.prisma.url.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    const newUrl = await this.prisma.url.update({
      where: { id },
      data: {
        originalUrl: updateUrlDto.original_url,
      },
    });

    return new UrlPresenter(newUrl);
  }

  async remove(id: string, user: any) {
    const userId = user?.id;

    const url = await this.prisma.url.findFirst({
      where: {
        id,
        userId,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.prisma.url.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return;
  }
}
