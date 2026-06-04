import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('hospital/login')
hospitalLogin(
  @Body()
  body: {
    email: string;
    password: string;
  },
) {
  return this.authService.hospitalLogin(
    body.email,
    body.password,
  );
}

  @Post('register')
  register(
    @Body()
    body: {
      fullName: string;
      email: string;
      mobile: string;
      password: string;
      gender?: string;
      age?: number;
      city?: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    return this.authService.login(
      body.email,
      body.password,
    );
  }
}