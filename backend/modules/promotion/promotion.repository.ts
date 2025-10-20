import { PrismaClient } from "@prisma/client";
import {
  CreatePromotionInput,
  UpdatePromotionInput,
} from "./promotion.schemas";

export class PromotionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findAll() {
    return await this.prisma.promotion.findMany({
      include: {
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!promotion) {
      throw new Error("Promotion not found");
    }
    return promotion;
  }

  async findByCode(code: string) {
    return await this.prisma.promotion.findUnique({
      where: { code: code.toUpperCase() },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async create(data: CreatePromotionInput) {
    return await this.prisma.promotion.create({
      data: {
        ...data,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        code: data.code ? data.code.toUpperCase() : undefined,
        usedCount: 0,
      },
      include: {
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdatePromotionInput) {
    await this.findById(id); // Check if exists

    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    if (data.code) updateData.code = data.code.toUpperCase();

    return await this.prisma.promotion.update({
      where: { id },
      data: updateData,
      include: {
        destination: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async delete(id: string) {
    await this.findById(id); // Check if exists
    return await this.prisma.promotion.delete({
      where: { id },
    });
  }
}
