import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const dateStr = searchParams.get("date"); // YYYY-MM-DD

        let query: any = {
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        };

        if (dateStr) {
            const startDate = new Date(dateStr);
            startDate.setHours(0, 0, 0, 0);

            const endDate = new Date(dateStr);
            endDate.setHours(23, 59, 59, 999);

            query.where = {
                createdAt: {
                    gte: startDate,
                    lte: endDate
                }
            };
        }

        const bills = await prisma.bill.findMany(query);
        return NextResponse.json(bills);
    } catch (error) {
        console.error("GET /api/bills error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, paymentMethod, totalAmount } = body;

        // input validation
        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Bill must have items" }, { status: 400 });
        }
        if (!paymentMethod) {
            return NextResponse.json({ error: "Payment method required" }, { status: 400 });
        }

        // Creating bill and related bill items in a transaction
        const newBill = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create the Bill
            const bill = await tx.bill.create({
                data: {
                    totalAmount: parseFloat(totalAmount.toString()),
                    paymentMethod,
                    items: {
                        create: items.map((item: any) => ({
                            productId: item.productId,
                            quantity: parseInt(item.quantity.toString(), 10),
                            price: parseFloat(item.price.toString()),
                        })),
                    },
                },
                include: {
                    items: true
                }
            });
            return bill;
        });

        return NextResponse.json(newBill, { status: 201 });
    } catch (error) {
        console.error("POST /api/bills error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
