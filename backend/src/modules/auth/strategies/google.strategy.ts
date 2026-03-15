import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const backendUrl = configService.get<string>('app.backendUrl', 'http://localhost:5000');
    super({
      clientID: configService.get<string>('app.google.clientId')!,
      clientSecret: configService.get<string>('app.google.clientSecret')!,
      callbackURL: `${backendUrl}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = {
      provider: 'google' as const,
      providerId: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName,
    };
    done(null, user);
  }
}
