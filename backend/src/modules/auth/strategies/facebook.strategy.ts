import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    const backendUrl = configService.get<string>('app.backendUrl', 'http://localhost:5000');
    super({
      clientID: configService.get<string>('app.facebook.appId')!,
      clientSecret: configService.get<string>('app.facebook.appSecret')!,
      callbackURL: `${backendUrl}/auth/facebook/callback`,
      scope: ['public_profile', 'email'],
      profileFields: ['id', 'emails', 'name', 'displayName'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (error: Error | null, user?: Record<string, unknown>) => void,
  ) {
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : `${profile.id}@facebook.com`;

    const user = {
      provider: 'facebook' as const,
      providerId: profile.id,
      email,
      name: profile.displayName,
    };
    done(null, user);
  }
}
