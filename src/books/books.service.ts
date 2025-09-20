import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

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
      

}
