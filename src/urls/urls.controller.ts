import { Controller, Get, Post, Body, Param, Redirect } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';

import { Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiResponse({ status: 403, description: 'Origin not allowed by CORS' })
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @ApiOperation({ summary: 'Create a new shortened URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully created.',
  })
  create(@Body() createUrlDto: CreateUrlDto) {
    return this.urlsService.create(createUrlDto);
  }

  @Get(':shortCode')
  @Redirect()
  @ApiOperation({ summary: 'redirect a shortened url to the original one' })
  @ApiResponse({
    status: 302,
    description:
      'Redirects to the original URL based on the provided short code.',
  })
  @ApiResponse({ status: 404, description: 'URL not found or expired' })
  async redirect(@Param('shortCode') short_code: string) {
    return this.urlsService.redirect(short_code);
  }
}
