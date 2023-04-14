import { compare, hash, hashSync } from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  /**
   * create user service to access user table
   */
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
      const user = await this.userRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(
          'user not found with email address: ' + email,
        );
      }
      return user;
    } catch (error) {}
  }
  async validateUser(email: string, password: string) {
    try {
      const user = await this.findByEmail(email);
      if (!user || (await compare(password, user.password))) {
        throw new BadRequestException('user email or password incorrect!');
      }
      delete user.password;
      return user;
    } catch (error) {
      throw new InternalServerErrorException('somethings went wrong');
    }
  }
}
