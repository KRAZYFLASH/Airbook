import { FlightScheduleRepository } from "./flight-schedule.repository";
import { CreateFlightScheduleInput, UpdateFlightScheduleInput } from "./flight-schedule.schemas";

export class FlightScheduleService {
  constructor(private flightScheduleRepository: FlightScheduleRepository) {}

  async getAllFlightSchedules() {
    try {
      return await this.flightScheduleRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getFlightScheduleById(id: string) {
    try {
      return await this.flightScheduleRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createFlightSchedule(data: CreateFlightScheduleInput) {
    try {
      // Validate departure is before arrival
      const departureTime = new Date(data.departure);
      const arrivalTime = new Date(data.arrival);
      
      if (departureTime >= arrivalTime) {
        throw new Error("Arrival time must be after departure time");
      }

      return await this.flightScheduleRepository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async updateFlightSchedule(id: string, data: UpdateFlightScheduleInput) {
    try {
      // Validate departure is before arrival if both are provided
      if (data.departure && data.arrival) {
        const departureTime = new Date(data.departure);
        const arrivalTime = new Date(data.arrival);
        
        if (departureTime >= arrivalTime) {
          throw new Error("Arrival time must be after departure time");
        }
      }

      return await this.flightScheduleRepository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async deleteFlightSchedule(id: string) {
    try {
      return await this.flightScheduleRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}