import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import express from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: express.Request) => {
          let token: string | null = null;
          if (req && req.cookies && typeof req.cookies === 'object') {
            const cookies = req.cookies as Record<string, unknown>;
            const jwtValue = cookies['jwt'];
            if (typeof jwtValue === 'string') {
              token = jwtValue;
            }
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY || '',
    });
  }

  validate(payload: { sub: number; email: string; name: string }) {
    return { id: payload.sub, email: payload.email, name: payload.name };
  }
}
