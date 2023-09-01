import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signInDto';
import { SignUpDTO } from './dto/signUpDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() signUpDto: SignUpDTO){
        return this.authService.signUp(signUpDto)
    }
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() signInDto: SignInDTO) {
      return this.authService.signIn(signInDto);
    }
}
