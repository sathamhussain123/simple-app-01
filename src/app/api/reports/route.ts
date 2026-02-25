import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "daily"; // daily, weekly, monthly, yearly

        const now = new Date();
        let startDate = new Date();

        // Determine date range
        if (range === "weekly") {
            startDate.setDate(now.getDate() - 7);
        } else if (range === "monthly") {
            startDate.setMonth(now.getMonth() - 1);
        } else if (range === "yearly") {
            startDate.setFullYear(now.getFullYear() - 1);
        }
        // Default to daily
        startDate.setHours(0, 0, 0, 0);

        const bills = await prisma.bill.findMany({
            where: {
                createdAt: { gte: startDate }
            },
            include: {
                items: true
            }
        });

        const totalBills = bills.length;
        let totalSales = 0;

        // Aggregating top items
        const productCounts: Record<string, number> = {};

        bills.forEach(bill => {
            totalSales += bill.totalAmount;
            bill.items.forEach(item => {
                productCounts[item.productId] = (productCounts[item.productId] || 0) + item.quantity;
            });
        });

        // Determine top selling item ID
        let topItem = null;
        if (Object.keys(productCounts).length > 0) {
            const topProductId = Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b);
            topItem = await prisma.product.findUnique({ where: { id: topProductId } });
        }

        return NextResponse.json({
            startDate,
            endDate: now,
            summary: {
                totalSales,
                totalBills,
                topItem: topItem ? { name: topItem.name, quantitySold: productCounts[topItem.id] } : null
            }
        });
    } catch (error) {
        console.error("GET /api/reports error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
