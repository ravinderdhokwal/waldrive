import prisma from "../configs/prisma.configs.js";
import type { User } from "../generated/prisma/client.js";

interface UserParams {
    fullName: string;
    email: string;
    password: string;
}

export class UserService {

    static async createUser({ fullName, email, password }: UserParams): Promise<User> {
        return await prisma.user.create({ data: { fullName, email, password } });
    }

    static async findUserById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id } });
    }

    static async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }

    static async updateUserProfile(userId: string, name: string): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { fullName: name },
        });
    }

    static async incrementUsedStorage(userId: string, size: number): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { usedStorage: { increment: size } }
        });
    }

    static async decrementUsedStorage(userId: string, size: number): Promise<User> {
        return await prisma.user.update({
            where: { id: userId },
            data: { usedStorage: { decrement: size } }
        });
    }
}