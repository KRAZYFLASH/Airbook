import { PromotionRepository } from "./promotion.repository";
import {
  CreatePromotionInput,
  UpdatePromotionInput,
} from "./promotion.schemas";

export class PromotionService {
  constructor(private promotionRepository: PromotionRepository) {}

  async getAllPromotions() {
    try {
      return await this.promotionRepository.findAll();
    } catch (error) {
      throw error;
    }
  }

  async getPromotionById(id: string) {
    try {
      return await this.promotionRepository.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async createPromotion(data: CreatePromotionInput) {
    try {
      console.log("🔍 Creating promotion with data:", data);

      // Validate start date is before end date
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (startDate >= endDate) {
        throw new Error("End date must be after start date");
      }

      // Check if code already exists (only if code is provided)
      if (data.code) {
        console.log("🔍 Checking if promotion code exists:", data.code);
        const existingPromo = await this.promotionRepository.findByCode(
          data.code
        );
        console.log("🔍 Existing promotion found:", existingPromo);

        if (existingPromo) {
          console.log("❌ Promotion code already exists:", data.code);
          throw new Error("Promotion code already exists");
        }
      }

      console.log("✅ Creating new promotion");
      return await this.promotionRepository.create(data);
    } catch (error) {
      console.error("❌ Error in createPromotion service:", error);
      throw error;
    }
  }

  async updatePromotion(id: string, data: UpdatePromotionInput) {
    try {
      // Validate dates if both provided
      if (data.startDate && data.endDate) {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);

        if (startDate >= endDate) {
          throw new Error("End date must be after start date");
        }
      }

      // Check if code already exists (if updating code)
      if (data.code) {
        const existingPromo = await this.promotionRepository.findByCode(
          data.code
        );
        if (existingPromo && existingPromo.id !== id) {
          throw new Error("Promotion code already exists");
        }
      }

      return await this.promotionRepository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async deletePromotion(id: string) {
    try {
      return await this.promotionRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}

// Create instance with repository
import { prisma } from "../../../db/prisma";
const promotionRepository = new PromotionRepository(prisma);
export const promotionService = new PromotionService(promotionRepository);
