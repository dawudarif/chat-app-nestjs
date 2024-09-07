import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(CookieStrategy.name); // Logger with context

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          let token = null;
          // Try to extract token from HTTP cookies or WebSocket handshake headers
          if (req) {
            if (req.cookies) {
              // Log cookies (this should work for HTTP requests)
              this.logger.debug('Cookies in HTTP request:', req.cookies);
              token = req.cookies['jwt']; // Extract token from HTTP cookie
            } else if (req.handshake && req.handshake.headers) {
              // For WebSocket connection, use handshake headers
              this.logger.debug(
                'Headers in WebSocket handshake:',
                req.handshake.headers,
              );
              const cookieHeader = req.handshake.headers.cookie;
              if (cookieHeader) {
                // Parse the JWT from the cookie header manually
                const cookies = cookieHeader
                  .split('; ')
                  .reduce((acc, cookie) => {
                    const [name, value] = cookie.split('=');
                    acc[name] = value;
                    return acc;
                  }, {});

                this.logger.debug('Cookies in WebSocket handshake:', cookies);
                token = cookies['jwt'];
              }
            }
          }

          if (!token) {
            this.logger.warn('No JWT token found in request');
          } else {
            this.logger.debug(`JWT Token found: ${token}`);
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    });
  }

  async validate(payload: any) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
    };
  }
}
