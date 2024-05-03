import { ConfigModule, ConfigService } from '@nestjs/config';
export const jwtConfig = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get<string>('jwt_secret'),
  }),
  inject: [ConfigService],
};
