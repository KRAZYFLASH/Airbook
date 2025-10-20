import { Request, Response } from "express";
import { promotionService } from "./promotion.service";
import {
  CreatePromotionSchema,
  UpdatePromotionSchema,
} from "./promotion.schemas";

export class PromotionController {
  static async getAllPromotions(req: Request, res: Response): Promise<void> {
    try {
      console.log("🔍 Getting all promotions");
      const promotions = await promotionService.getAllPromotions();

      res.json({
        success: true,
        message: "Promotions retrieved successfully",
        data: promotions,
      });
    } catch (error) {
      console.error("❌ Error getting promotions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get promotions",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async getPromotionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`🔍 Getting promotion with id: ${id}`);

      const promotion = await promotionService.getPromotionById(id);

      if (!promotion) {
        res.status(404).json({
          success: false,
          message: "Promotion not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Promotion retrieved successfully",
        data: promotion,
      });
    } catch (error) {
      console.error("❌ Error getting promotion:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get promotion",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async createPromotion(req: Request, res: Response): Promise<void> {
    try {
      console.log("📝 Creating new promotion:", req.body);
      console.log("🔍 Raw JSON body:", JSON.stringify(req.body, null, 2));

      const validatedData = CreatePromotionSchema.parse(req.body);
      console.log("✅ Validation passed, validated data:", validatedData);
      const promotion = await promotionService.createPromotion(validatedData);

      res.status(201).json({
        success: true,
        message: "Promotion created successfully",
        data: promotion,
      });
    } catch (error) {
      console.error("❌ Error creating promotion:", error);
      console.error("❌ Error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.status(500).json({
        success: false,
        message: "Failed to create promotion",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async updatePromotion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`✏️ Updating promotion with id: ${id}`, req.body);
      console.log(
        "🔍 Raw JSON update body:",
        JSON.stringify(req.body, null, 2)
      );

      const validatedData = UpdatePromotionSchema.parse(req.body);
      console.log(
        "✅ Update validation passed, validated data:",
        validatedData
      );
      const promotion = await promotionService.updatePromotion(
        id,
        validatedData
      );

      if (!promotion) {
        res.status(404).json({
          success: false,
          message: "Promotion not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Promotion updated successfully",
        data: promotion,
      });
    } catch (error) {
      console.error("❌ Error updating promotion:", error);
      console.error("❌ Update error details:", {
        name: error instanceof Error ? error.name : "Unknown",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      res.status(500).json({
        success: false,
        message: "Failed to update promotion",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  static async deletePromotion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      console.log(`🗑️ Deleting promotion with id: ${id}`);

      const deleted = await promotionService.deletePromotion(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Promotion not found",
        });
        return;
      }

      res.json({
        success: true,
        message: "Promotion deleted successfully",
      });
    } catch (error) {
      console.error("❌ Error deleting promotion:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete promotion",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
