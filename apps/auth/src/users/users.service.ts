import { compare, compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const hashPassword = hashSync(createUserDto.password, 10);
      const createUserResponse = await this.userRepository.create({
        email: createUserDto.email,
        password: hashPassword,
        verified: false,
      });
      const { email, _id } = createUserResponse;
      return { id: _id, email: email };
    } catch (error) {
      throw new BadRequestException('Unable to create new user');
    }
  }

  private async findByEmail(email: string): Promise<UserDocument> {
    try {
      const user = await this.userRepository.findOneForUser({ email });
      if (!user) {
        throw new NotFoundException(
          'user not found with email address: ' + email,
        );
      }
      return user;
    } catch (error) {}
  }

  async findOne(id: string): Promise<UserDocument> {
    const user = await this.userRepository.findOne({ _id: id });
    if (!user) {
      throw new NotFoundException('user not found with email address: ' + id);
    }
    return user;
  }
  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('user email or password incorrect!');
    }
    if (!compareSync(password, user.password)) {
      throw new UnauthorizedException('user email or password incorrect!');
    }
    delete user.password;
    return user;
  }

  async getAllUsers() {
    return this.userRepository.find({});
  }
}
