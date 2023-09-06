import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDTO } from './dto/signInDto';
import { SignUpDTO } from './dto/signUpDto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({description:'Register the user with email and password'})
    @ApiResponse({ status: HttpStatus.CREATED, description: "The user has been registered" }) 
    @ApiResponse({ status: HttpStatus.CONFLICT, description: "The email is already in use" }) 
    @Post('sign-up')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() signUpDto: SignUpDTO){
        return this.authService.signUp(signUpDto)
    }
    @ApiOperation({description:'Verify if email and password are corrects and returns a token'})
    @ApiResponse({ status: HttpStatus.OK, description: "It's all ok and the token has been created" }) 
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: "The email is not registered or the password is wrong" }) 
    @Post('sign-in')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() signInDto: SignInDTO) {
      return this.authService.signIn(signInDto);
    }
}
