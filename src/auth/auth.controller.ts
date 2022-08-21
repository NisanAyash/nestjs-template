import { Controller, Post, Body, Get, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUsers() {
    return this.authService.getUsers();
  }

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(200)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
