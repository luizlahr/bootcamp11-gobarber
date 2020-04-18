import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const routes = Router();

routes.post('/', async (request, response) => {
  const { email, password } = request.body;
  const auth = new CreateSessionService();

  const { user, token } = await auth.execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default routes;
