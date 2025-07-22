import { Url } from 'generated/prisma';

export class UrlPresenter {
  constructor(readonly url: Url) {}

  toJSON() {
    return {
      id: this.url.id,
      shortUrl: this.url.shortUrl,
      shortCode: this.url.shortCode,
      originalUrl: this.url.originalUrl,
      clicks: this.url.clicks,
      createdAt: this.url.createdAt,
      updatedAt: this.url.updatedAt,
    };
  }
}
