import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;

  const mockUrlsService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    expect(controller.create({ original_url: 'https://example.com' })).toEqual({
      short_url: 'https://example.com/SHORTC',
    });
  });

  it('should redirect to the original URL', async () => {
    expect(await controller.redirect('SHORTC')).toEqual({
      url: 'https://example.com',
    });
  });
});
