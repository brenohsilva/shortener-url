/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

describe('UrlsController', () => {
  let controller: UrlsController;
  const now = new Date();
  const req: any = {
    user: {
      id: Number,
      email: String,
    },
  };

  const mockUrlsService = {
    create: jest.fn().mockImplementation((createUrlDto) => {
      return {
        short_url: `https://example.com/SHORTC`,
      };
    }),
    redirect: jest.fn().mockImplementation((short_code) => {
      if (short_code === 'SHORTC') {
        return 'https://example.com';
      }
      throw new Error('URL not found or expired');
    }),
    findAll: jest.fn().mockImplementation((user: any) => {
      return [
        {
          id: 'uuid',
          shortCode: 'CODE01',
          originalUrl: 'https://example.com',
          shortUrl: 'http://localhost:3000/CODE01',
          clicks: 0,
          createAt: now,
          updateAt: now,
        },
      ];
    }),
    findOne: jest.fn().mockImplementation((id: string, user: any) => {
      return {
        id,
        shortCode: 'CODE01',
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/CODE01',
        clicks: 0,
        createAt: now,
        updateAt: now,
      };
    }),
    update: jest
      .fn()
      .mockImplementation(
        (id: string, updateUrlDto: UpdateUrlDto, user: any) => {
          return {
            id,
            shortUrl: 'http://localhost:3000/CODE01',
            shortCode: 'CODE01',
            originalUrl: updateUrlDto.original_url,
            clicks: 0,
            createAt: now,
            updateAt: now,
          };
        },
      ),
    remove: jest.fn().mockImplementation((id: string, user: any) => {
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [UrlsService],
    })
      .overrideProvider(UrlsService)
      .useValue(mockUrlsService)
      .compile();

    controller = module.get<UrlsController>(UrlsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a Short UrL', () => {
    const createUrlDto: CreateUrlDto = {
      original_url: 'https://example.com',
    };

    expect(controller.create(createUrlDto, req.user)).toEqual({
      short_url: 'https://example.com/SHORTC',
    });
  });

  it('should redirect to the original URL', async () => {
    expect(await controller.redirect('SHORTC')).toEqual('https://example.com');
  });

  it('should find all urls of the user', async () => {
    expect(await controller.findAll(req.user)).toEqual([
      {
        id: 'uuid',
        shortCode: 'CODE01',
        originalUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/CODE01',
        clicks: 0,
        createAt: now,
        updateAt: now,
      },
    ]);
  });

  it('should find one url of the user', async () => {
    expect(await controller.findOne('uuid', req.user)).toEqual({
      id: 'uuid',
      shortCode: 'CODE01',
      originalUrl: 'https://example.com',
      shortUrl: 'http://localhost:3000/CODE01',
      clicks: 0,
      createAt: now,
      updateAt: now,
    });
  });

  it('should update a url of the user', async () => {
    const updateUrlDto: UpdateUrlDto = {
      original_url: 'https://newexample.com',
    };
    expect(await controller.update('uuid', updateUrlDto, req.user)).toEqual({
      id: 'uuid',
      shortUrl: 'http://localhost:3000/CODE01',
      shortCode: 'CODE01',
      originalUrl: updateUrlDto.original_url,
      clicks: 0,
      createAt: now,
      updateAt: now,
    });
  });

  it('should remove a url of the user', async () => {
    expect(await controller.remove('uuid', req.user)).toBeUndefined();
  });
});
