import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
        select: {
          id: true,
          email: true,
          created_at: true,
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ForbiddenException('This user already exists.');
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) throw new ForbiddenException('Credentials incorrect');

      const passwordMatches = await argon.verify(user.hash, dto.password);

      if (!passwordMatches)
        throw new ForbiddenException('Credentials incorrect');

      delete user.hash;

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUsers() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async deleteUser(email: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: {
          email,
        },
      });

      return { email: deletedUser.email, message: 'User deleted successfully' };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ForbiddenException('The user is not exists');
      }

      throw error;
    }
  }
}
