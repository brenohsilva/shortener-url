/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

describe('UrlsService', () => {
  let service: UrlsService;
  const now = new Date();
  const req: any = {
    user: {
      id: 1,
      email: 'johndoe@hotmail.com',
    },
  };
  const mockPrismaService = {
    url: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        originalUrl: 'https://example.com',
        shortCode: 'SHORTC',
        shortUrl: 'https://example.com/SHORTC',
      }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'uuid',
          shortCode: 'CODE01',
          originalUrl: 'https://example.com',
          shortUrl: 'http://localhost:3000/CODE01',
          clicks: 0,
          createdAt: now,
          updatedAt: now,
        },
      ]),
      findFirst: jest.fn().mockResolvedValue({
        id: 'uuid',
        userId: req.user.id,
        shortCode: 'CODE01',
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/CODE01',
        clicks: 0,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        expiresAt: null,
      }),
      update: jest.fn().mockResolvedValue({
        id: 'uuid',
        userId: req.user.id,
        shortCode: 'CODE01',
        originalUrl: 'https://newexample.com',
        shortUrl: 'http://localhost:3000/CODE01',
        clicks: 0,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        expiresAt: null,
      }),
    },
    $transaction: jest
      .fn()
      .mockImplementation(async (fn) => await fn(mockPrismaService)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a short URL', async () => {
    const createUrlDto: CreateUrlDto = {
      original_url: 'https://example.com',
    };

    expect(await service.create(createUrlDto, req.user)).toEqual({
      short_url: 'https://example.com/SHORTC',
    });
  });

  it('should redirect to the original URL', async () => {
    expect(await service.redirect('SHORTC')).toEqual({
      url: 'https://example.com',
    });
  });

  it('should return all urls of the user', async () => {
    const result = await service.findAll(req.user);
    expect(result.map((r) => r.url)).toEqual([
      {
        id: 'uuid',
        shortCode: 'CODE01',
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/CODE01',
        clicks: 0,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  });

  it('should return one url of the user', async () => {
    expect((await service.findOne('uuid', req.user)).toJSON()).toEqual({
      id: 'uuid',
      shortCode: 'CODE01',
      originalUrl: 'https://example.com',
      shortUrl: 'http://localhost:3000/CODE01',
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    });
  });

  it('should update the original url of the user', async () => {
    const updateUrlDto: UpdateUrlDto = {
      original_url: 'https://newexample.com',
    };
    expect(
      (await service.update('uuid', updateUrlDto, req.user)).toJSON(),
    ).toEqual({
      id: 'uuid',
      shortCode: 'CODE01',
      originalUrl: 'https://newexample.com',
      shortUrl: 'http://localhost:3000/CODE01',
      clicks: 0,
      createdAt: now,
      updatedAt: now,
    });
  });

  it('should remove a url of the user', async () => {
    mockPrismaService.url.findFirst.mockResolvedValueOnce({
      id: 'uuid',
      userId: req.user.id,
      shortCode: 'CODE01',
      originalUrl: 'https://example.com',
      shortUrl: 'http://localhost:3000/CODE01',
      clicks: 0,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      expiresAt: null,
    });

    mockPrismaService.url.update.mockResolvedValueOnce({
      id: 'uuid',
      deletedAt: now,
    });

    expect(await service.remove('uuid', req.user)).toBeUndefined();
  });
});
