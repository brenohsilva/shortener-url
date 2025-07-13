import { Controller, Get, Post, Body, Param, Redirect } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

import { Response } from 'express';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') short_code: string) {
    const originalUrl = await this.urlsService.redirect(short_code);
    return { url: originalUrl };
  }
}
