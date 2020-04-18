import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import { parseISO } from 'date-fns';
import AuthMiddleware from '../middlewares/AuthMiddleware';

import AppointmentRepo from '../repositories/AppointmentRepo';
import CreateAppointmentService from '../services/CreateAppointmentService';

const routes = Router();

routes.use(AuthMiddleware);

routes.get('/', async (request, response) => {
  const appointmentRepo = getCustomRepository(AppointmentRepo);
  const appointments = await appointmentRepo.find();

  return response.json(appointments);
});

routes.post('/', async (request, response) => {
  const { provider_id, date } = request.body;
  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider_id,
  });

  return response.json(appointment);
});

export default routes;
