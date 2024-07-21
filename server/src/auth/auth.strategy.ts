import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['jwt'];
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
