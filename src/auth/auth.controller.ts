import { Controller, Post, Body, Get, HttpCode, Delete, Header } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, EmailDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getUsers() {
    return this.authService.getUsers();
  }

  @Post('signup')
  @HttpCode(201)
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @HttpCode(200)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Delete('delete')
  @HttpCode(200)
  delete(@Body() dto: EmailDto) {
    return this.authService.deleteUser(dto.email);
  }
}
