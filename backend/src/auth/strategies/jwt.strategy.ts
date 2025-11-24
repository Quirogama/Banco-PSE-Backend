import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get('JWT_SECRET') || 'secret-key-change-in-production',
    });
  }

  validate(payload: any) {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      userId: payload.sub as number,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      email: payload.email as string,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      rol: payload.rol as string,
    };
  }
}
