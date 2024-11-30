import { PrismaClient } from "@prisma/client";
import { CreateUserDto } from "src/schemas";

const prisma = new PrismaClient();

export async function findUser(username: string) {
    return await prisma.user.findUnique({ where: { username } });
}

export async function createUser(data: CreateUserDto) {
    return await prisma.user.create({
        data,
    });
}