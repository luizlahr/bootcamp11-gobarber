import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepo from '../repositories/AppointmentRepo';
import AppError from '../exceptions/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentRepo = getCustomRepository(AppointmentRepo);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentRepo.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = appointmentRepo.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentRepo.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
