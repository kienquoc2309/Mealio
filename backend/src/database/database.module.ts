import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectConnection, MongooseModule } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import databaseConfig from '../config/database.config';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    const { readyState } = this.connection;

    if (readyState === ConnectionStates.connected) {
      this.logger.log('MongoDB connected successfully');
      console.log('MongoDB connected successfully');
    } else if (readyState === ConnectionStates.connecting) {
      this.connection.on('connected', () => {
        this.logger.log('MongoDB connected successfully');
        console.log('MongoDB connected successfully');
      });
    }

    this.connection.on('error', (error: Error) => {
      this.logger.error(`MongoDB connection error: ${error.message}`);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('MongoDB disconnected');
    });
  }
}
