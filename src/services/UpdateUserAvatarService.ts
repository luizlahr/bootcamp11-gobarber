import { getRepository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import User from '../models/User';
import uploadConfig from '../config/upload';
import AppError from '../exceptions/AppError';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepo = getRepository(User);

    const user = await userRepo.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const checkAvatar = fs.promises.stat(userAvatarFilePath);

      if (checkAvatar) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;
    await userRepo.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
