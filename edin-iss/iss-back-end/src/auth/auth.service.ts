import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    if (dto.password !== dto.repeatPassword) {
      throw new ForbiddenException('Passwords do not match');
    }

    const password = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      return { message: 'You are successfully registered' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatches = await argon.verify(user.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

    const token = await this.jwtService.signAsync({ userId: user.id });

    res.cookie('jwt', token, { httpOnly: true, secure: false });

    return res.json({
      message: 'You are successfully signed in',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imgUrl: user.imgUrl,
      },
    });
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('jwt');
    return res.send({ message: 'Logged out successfully' });
  }

  async updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto) {
    // Check if newPassword and repeatNewPassword match
    if (updatePasswordDto.newPassword !== updatePasswordDto.repeatNewPassword) {
      throw new ForbiddenException(
        'New password and repeat password do not match',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordsMatch = await argon.verify(
      user.password,
      updatePasswordDto.currentPassword,
    );
    if (!passwordsMatch) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await argon.hash(updatePasswordDto.newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return 'Your password is changed successfully.';
  }
}
