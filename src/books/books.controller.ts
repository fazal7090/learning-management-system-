import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service'
import { AuthGuard } from '../auth/auth.guard';

@Controller('books')
export class BooksController {
    constructor(private booksService: BooksService) { }

    @UseGuards(AuthGuard)
    @Get('all')
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('sortBy') sortBy = 'createdAt',
        @Query('order') order: 'asc' | 'desc' = 'asc',
        @Query('author') author?: string,
        @Query('category') category?: string,
    ) {
        return this.booksService.findAll(+page, +limit, sortBy, order, { author, category });
    }

}
