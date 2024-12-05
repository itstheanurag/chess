import { CreateUserDto } from "src/schemas";
import { prisma } from "..";

export async function findUser(username: string) {
    return await prisma.user.findUnique({ where: { username } });
}

export async function createUser(data: CreateUserDto) {
    return await prisma.user.create({
        data,
    });
}