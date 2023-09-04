import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest()
        const { authorization } = request.headers
        try {
            const data = this.authService.checkToken((authorization ?? '').split(" ")[1])
            const user = await this.userService.getUserById(parseInt(data.sub));
            request.user = user; // colocando o usuário dentro da requiosição ou resposta
            return true;
        } catch (error) {
            throw new UnauthorizedException('Invalid Token!')
        }
    }
}