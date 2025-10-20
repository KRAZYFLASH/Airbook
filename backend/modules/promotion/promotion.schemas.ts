import { z } from "zod";

export const PromotionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  code: z.string().min(1, "Code is required").optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).default("PERCENTAGE"),
  discountValue: z.number().positive("Discount value must be positive"),
  minPurchase: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  destinationId: z.string().optional(),
});

export const CreatePromotionSchema = PromotionSchema;
export const UpdatePromotionSchema = PromotionSchema.partial();

export type CreatePromotionInput = z.infer<typeof CreatePromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof UpdatePromotionSchema>;
