import { Body, Controller, Get, Logger, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@auth/authentication/current-user.decorator';
import { JwtAuthGuard } from '@auth/authentication/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument } from './models/user.schema';

@Controller('users')
export class UsersController {
  protected readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getUserProfile(@CurrentUser() user: UserDocument) {
    this.logger.log('user logger', user);
    return user;
  }

  @Post()
  create(@Body() userDto: CreateUserDto) {
    return this.usersService.create(userDto);
  }
}
