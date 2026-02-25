import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, category, price, isAvailable } = body;

        const dataToUpdate: any = {};
        if (name !== undefined) dataToUpdate.name = name;
        if (category !== undefined) dataToUpdate.category = category;
        if (price !== undefined) dataToUpdate.price = parseFloat(price.toString());
        if (isAvailable !== undefined) dataToUpdate.isAvailable = isAvailable;

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: dataToUpdate,
        });

        return NextResponse.json(updatedProduct);
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        console.error("PUT /api/products/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }
        console.error("DELETE /api/products/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
