import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guard/jwt.guard';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: AuthDto) {
    console.log('Signup request received:', dto); // Log the incoming data
    return this.authService.signup(dto);
  }

  @Post('signin')
  async signin(@Body() dto: LoginDto, @Res() res: Response) {
    return this.authService.signin(dto, res);
  }

  @Post('signout')
  async signout(@Req() req: Request, @Res() res: Response) {
    return this.authService.signout(req, res);
  }
}
