import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import express from 'express';

@Injectable()
export class JwtUserStrategy extends PassportStrategy(Strategy, 'userjwt') {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET_KEY;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY environment variable is not set');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: express.Request) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['userjwt'];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Uses same secret as admin login
    });
  }

  // Automatically executed when a valid JWT is found
  validate(payload: { sub: number; code: string }) {
    return { id: payload.sub, code: payload.code };
  }
}
