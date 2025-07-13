import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma.service';

describe('UrlsService', () => {
  let service: UrlsService;
  const mockPrismaService = {
    url: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        originalUrl: 'https://example.com',
        shortCode: 'SHORTC',
        shortUrl: 'https://example.com/SHORTC',
      }),
      findFirst: jest.fn().mockResolvedValue({
        originalUrl: 'https://example.com',
        shortCode: 'SHORTC',
        deletedAt: null,
        expiresAt: null,
      }),
      update: jest.fn().mockResolvedValue({
        clicks: 1,
      }),
    },
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
    expect(
      await service.create({ original_url: 'https://example.com' }),
    ).toEqual({
      short_url: 'https://example.com/SHORTC',
    });
  });

  it('should redirect to the original URL', async () => {
    expect(await service.redirect('SHORTC')).toEqual('https://example.com');
  });

  it('should throw NotFoundError if URL does not exist', async () => {
    mockPrismaService.url.findFirst.mockResolvedValue(null);
    await expect(service.redirect('NONEXISTENT')).rejects.toThrow(
      'URL not found or expired',
    );
  });

  it('should return existing short URL if it already exists', async () => {
    mockPrismaService.url.findUnique.mockResolvedValue({
      shortUrl: 'https://example.com/SHORTC',
    });
    expect(
      await service.create({ original_url: 'https://example.com' }),
    ).toEqual({
      short_url: 'https://example.com/SHORTC',
    });
  });
});
