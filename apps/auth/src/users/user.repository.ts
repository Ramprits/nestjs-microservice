import { Model } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common/services';
import { InjectModel } from '@nestjs/mongoose';

import { UserDocument } from './models/user.schema';

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  protected readonly logger: Logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    userModel: Model<UserDocument>,
  ) {
    super(userModel);
  }
}
