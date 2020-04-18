import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';
import AppError from '../exceptions/AppError';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExists) {
      throw new AppError('Email address already used.', 422);
    }

    const hashedPassword = await hash(password, 8);

    const user = await userRepository.save({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
