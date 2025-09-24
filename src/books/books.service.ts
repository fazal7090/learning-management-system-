import { Injectable,NotFoundException,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateReviewDto } from './dto/reviewbook.dto'

@Injectable()
export class BooksService {
    constructor(private prisma: PrismaService) {}

    async findAll(
        page: number,
        limit: number,
        sortBy: string,
        order: 'asc' | 'desc',
        filters: { author?: string; category?: string },
      ) {
        const where: any = {};
      
        if (filters.author) {
        where.author = { equals: filters.author, mode: 'insensitive' };
        }
        if (filters.category) {
        where.category = { equals: filters.category };
        }
      
        const books = await this.prisma.book.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where,
          orderBy: { [sortBy]: order },
        });
      
        const total = await this.prisma.book.count({ where });
      
        return {
          data: books,
          meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        };
      }
      
      async borrowBook(bookId: number, userId: number) {
        const book = await this.prisma.book.findUnique({ where: { id: bookId } });
        if (!book) throw new NotFoundException('Book not found');
      
        if (book.quantity <= 0) {
          throw new BadRequestException('Book is not available');
        }
      
        // Create borrow record
        await this.prisma.borrowRecord.create({
          data: {
            user: { connect: { id: userId } },
            book: { connect: { id: bookId } },
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // e.g. 2 weeks later
          },
        });
        
      
        // Update book quantity
        await this.prisma.book.update({
          where: { id: bookId },
          data: {
            quantity: { decrement: 1 },
            status: book.quantity - 1 > 0 ? 'AVAILABLE' : 'BORROWED',
          },
        });
      
        return { message: `Books "${book.title}" borrowed successfully!` };
      }

      async getDetails(bookId: number) {
        const book = await this.prisma.book.findUnique({
          where: { id: bookId },
        });
      
        if (!book) throw new NotFoundException('Book not found');
      
        return book;  // return the full book object
      }
      
      async reviewBook(bookId: number, userId: number, dto: CreateReviewDto) {
        // Ensure the user borrowed the book
        const borrowRecord = await this.prisma.borrowRecord.findFirst({
          where: { bookId, userId },
        });
      
        if (!borrowRecord) {
          throw new BadRequestException('You can only review books you have borrowed');
        }
      
        // Check if review already exists
        const existingReview = await this.prisma.review.findUnique({
          where: {
            userId_bookId: {  // composite key
              userId,
              bookId,
            },
          },
        });
      
        if (existingReview) {
    
          return this.prisma.review.update({
            where: {
              userId_bookId: { userId, bookId },
            },
            data: {
              rating: dto.rating,
              comment: dto.comment,
            },
          });
        }
      
        // Create new review
        return this.prisma.review.create({
          data: {
            user: { connect: { id: userId } },
            book: { connect: { id: bookId } },
            rating: dto.rating,
            comment: dto.comment,
          },
        });
      }
      
      async getAllReviews(bookId: number) {
        const reviews = await this.prisma.review.findMany({
          where: { bookId },
          include: {
            user: { select: { id: true, name: true } }, // optional: include user info
          },
        });
      
        if (reviews.length === 0) {
          throw new NotFoundException('No reviews found for this book');
        }
      
        return reviews;
      }
      

}
