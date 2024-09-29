import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(CookieStrategy.name);

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          let token = null;
          if (req) {
            if (req.cookies) {
              token = req.cookies['jwt'];
            } else if (req.handshake && req.handshake.headers) {
              const cookieHeader = req.handshake.headers.cookie;
              if (cookieHeader) {
                const cookies = cookieHeader
                  .split('; ')
                  .reduce((acc, cookie) => {
                    const [name, value] = cookie.split('=');
                    acc[name] = value;
                    return acc;
                  }, {});

                token = cookies?.jwt;
              }
            }
          }

          // if (!token) {
          //   this.logger.warn('No JWT token found in request');
          // } else {
          //   this.logger.debug(`JWT Token found: ${token}`);
          // }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    });
  }

  async validate(payload: any) {
    // this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
