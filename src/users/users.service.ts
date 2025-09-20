import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async findOne(id: number) {
        const data = await this.prisma.user.findUnique({ 
            where: { id } 
        });
        
        if (!data) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        
        const { password, ...response } = data;
        return response;
    }

    async updateUser(id: number, dto: UpdateUserDto) {
        const updateData: any = {};
    
        // check name
        if (dto.name) {
          updateData.name = dto.name;
        }
    
        // check password
        if (dto.password) {
          updateData.password = await bcrypt.hash(dto.password, 10);
        }
    
        // ensure at least one field is present
        if (Object.keys(updateData).length === 0) {
          throw new BadRequestException(
            'At least one field (name or password) must be provided',
          );
        }
    
        const data = await this.prisma.user.update({
          where: { id },
          data: updateData,
        });

        const {password, ... response} = data;

        return response;
      } 
}