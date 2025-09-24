import { 
    Controller, Get, Query, Req, UseGuards, Post, Param, Body, ParseIntPipe, DefaultValuePipe 
  } from '@nestjs/common';
  import { BooksService } from './books.service'
  import { AuthGuard } from '../auth/auth.guard';
  import { CreateReviewDto } from './dto/reviewbook.dto'
  
  @Controller('books')
  export class BooksController {
    constructor(private booksService: BooksService) {}
  
    // Get all books , query params will be sent from frontend
    @UseGuards(AuthGuard)
    @Get('all')
    async findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
      @Query('sortBy') sortBy = 'createdAt',
      @Query('order') order: 'asc' | 'desc' = 'asc',
      @Query('author') author?: string,
      @Query('category') category?: string,
    ) {
      return this.booksService.findAll(page, limit, sortBy, order, { author, category });
    }
  
    // Getting details of a particular book
    @UseGuards(AuthGuard)
    @Get(':id')
    async getBookdetails(@Param('id', ParseIntPipe) id: number) {
      return this.booksService.getDetails(id);
    }
  
    // Borrowing a book
    @UseGuards(AuthGuard)
    @Post(':id/borrow')
    async borrowBook(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
      const userId = req.user.userId; // from JWT payload
      return this.booksService.borrowBook(id, userId);
    }
  
    // Reviewing a book
    @UseGuards(AuthGuard)
    @Post(':id/review')
    async reviewBook(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: any,
      @Body() createReviewDto: CreateReviewDto,
    ) {
      const userId = req.user.userId; // from JWT payload
      return this.booksService.reviewBook(id, userId, createReviewDto);
    }
  
    // Getting all reviews of a specific book
    @UseGuards(AuthGuard)
    @Get(':id/allreviews')
    async allReviews(@Param('id', ParseIntPipe) id: number) {
      return this.booksService.getAllReviews(id);
    }
  }
  