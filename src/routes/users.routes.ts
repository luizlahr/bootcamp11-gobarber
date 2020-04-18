import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';

import AuthMiddleware from '../middlewares/AuthMiddleware';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';
import User from '../models/User';
import uploadConfig from '../config/upload';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/', async (request, response) => {
  const userRepository = getRepository(User);
  const users = await userRepository.find();

  return response.json(users);
});

routes.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (error) {
    return response.status(400).json({ error: error.message });
  }
});

routes.patch(
  '/avatar',
  AuthMiddleware,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatarService = new UpdateUserAvatarService();
    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    return response.json(user);
  },
);

export default routes;
