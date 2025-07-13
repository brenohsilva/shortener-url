import { Injectable } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { PrismaService } from 'src/prisma.service';
import { generateDeterministicCode } from 'src/utils/generate-unique-code';

@Injectable()
export class UrlsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUrlDto: CreateUrlDto) {
    const base_url = process.env.BASE_URL;

    const short_code = generateDeterministicCode(createUrlDto.original_url);
    const short_url = `${base_url}/${short_code}`;

    const existingUrl = await this.prisma.url.findUnique({
      where: {
        shortCode: short_code,
      },
    });

    if (existingUrl) {
      return {
        short_url: existingUrl.shortUrl,
      };
    }

    const newUrl = await this.prisma.url.create({
      data: {
        originalUrl: createUrlDto.original_url,
        shortCode: short_code,
        shortUrl: short_url,
      },
    });

    return {
      short_url: newUrl.shortUrl,
    };
  }

  async redirect(short_code: string) {
    const original_url = await this.prisma.url.findFirst({
      where: {
        shortCode: short_code,
        deletedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gte: new Date() } }],
      },
    });
    if (!original_url) {
      throw new Error('URL not found or expired');
    }

    return original_url.originalUrl;
  }
}
