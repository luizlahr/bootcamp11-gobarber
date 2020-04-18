import { Router } from 'express';
import appointments from './appointments.routes';
import users from './users.routes';
import sessions from './sessions.routes';

const routes = Router();

routes.use('/appointments', appointments);
routes.use('/users', users);
routes.use('/sessions', sessions);

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello Luiz' });
});

export default routes;
