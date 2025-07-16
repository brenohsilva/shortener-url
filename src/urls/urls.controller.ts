/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
  HttpCode,
  Delete,
  UseGuards,
  Patch,
  Request,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUrlDto } from './dto/update-url.dto';
import { AuthGuard } from '@nestjs/passport';
import { OptionalAuthGuard } from '../common/guards/optional-auth.guard';

@ApiResponse({ status: 403, description: 'Origin not allowed by CORS' })
@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('urls')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Create a new shortened URL' })
  @ApiResponse({
    status: 201,
    description: 'The URL has been successfully created.',
  })
  @ApiResponse({
    status: 409,
    description: 'User with the email already exists.',
  })
  create(@Body() createUrlDto: CreateUrlDto, @Request() req: any) {
    return this.urlsService.create(createUrlDto, req.user);
  }

  @Get('urls')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Find all the URLs of the user' })
  @ApiResponse({
    status: 200,
    description: 'Request successful.',
  })
  @ApiResponse({
    status: 204,
    description: 'No URL was found',
  })
  @ApiResponse({
    status: 401,
    description: 'Not Unauthorized',
  })
  async findAll(@Request() req: any) {
    return this.urlsService.findAll(req.user);
  }

  @Get('urls/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Find one URL of the user' })
  @ApiResponse({
    status: 200,
    description: 'Request successful.',
  })
  @ApiResponse({
    status: 404,
    description: 'The URL was not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Not Unauthorized',
  })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.urlsService.findOne(id, req.user);
  }

  @Get(':shortCode')
  @Redirect()
  @ApiOperation({ summary: 'redirect a shortened URL to the original one' })
  @ApiResponse({
    status: 302,
    description:
      'Redirects to the original URL based on the provided short code.',
  })
  @ApiResponse({ status: 404, description: 'URL not found' })
  @ApiResponse({
    status: 401,
    description: 'Not Unauthorized',
  })
  async redirect(@Param('shortCode') short_code: string) {
    return this.urlsService.redirect(short_code);
  }

  @Patch('urls/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update an URL of the user' })
  @ApiResponse({
    status: 200,
    description: 'Request successful.',
  })
  @ApiResponse({
    status: 404,
    description: 'The URL was not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Not Unauthorized',
  })
  async update(
    @Param('id') id: string,
    @Body() updateUrlDto: UpdateUrlDto,
    @Request() req: any,
  ) {
    return this.urlsService.update(id, updateUrlDto, req.user);
  }

  @Delete('urls/:id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  @ApiOperation({ summary: 'Soft delete an URL of the user' })
  @ApiResponse({
    status: 204,
    description: 'Not Content',
  })
  @ApiResponse({
    status: 401,
    description: 'Not Unauthorized',
  })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.urlsService.remove(id, req.user);
  }
}
