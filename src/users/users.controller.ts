import { Controller, Get, Param, ParseIntPipe, UseGuards,Patch, Req, BadRequestException,Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch('me')
  async updateUser(@Body() dto: UpdateUserDto, @Req() req: any) {
    if (!dto.name && !dto.password) {
      throw new BadRequestException('At least one field (name or password) must be provided');
    }
  
    return this.usersService.updateUser(req.user.userId, dto);
  }
  
}