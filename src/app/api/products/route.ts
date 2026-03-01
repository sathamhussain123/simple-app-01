import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");

        let queryOptions: Prisma.ProductFindManyArgs = {
            orderBy: { name: "asc" },
        };

        if (category) {
            queryOptions.where = { category: category as any };
        }

        const products = await prisma.product.findMany(queryOptions);

        return NextResponse.json(products);
    } catch (error) {
        console.error("GET /api/products error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, category, price, isAvailable } = body;

        if (!name || !category || price === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newProduct = await prisma.product.create({
            data: {
                name,
                category,
                price: parseFloat(price.toString()),
                isAvailable: isAvailable ?? true,
            },
        });
        let query: Prisma.BillFindManyArgs = {
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        };

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("POST /api/products error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
