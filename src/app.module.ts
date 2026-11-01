import * as Joi from 'joi';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimpleLoggerMiddleware } from './middlewares/simple-logger/simple-logger.middleware';
import { ALL_ENTITIES } from './database/entities';
import { UsersModule } from './users/users.module';
import { SpeciesModule } from './species/species.module';
import { BreedsModule } from './breeds/breeds.module';
import { PetsModule } from './pets/pets.module';
import { DiseasesModule } from './diseases/diseases.module';
import { QuestionnaireQuestionsModule } from './questionnaire-questions/questionnaire-questions.module';
import { ScreeningSessionsModule } from './screening-sessions/screening-sessions.module';
import { ScreeningAnswersModule } from './screening-answers/screening-answers.module';
import { ChatMessagesModule } from './chat-messages/chat-messages.module';
import { ImageScansModule } from './image-scans/image-scans.module';
import { ScreeningResultsModule } from './screening-results/screening-results.module';
import { VeterinaryServicesModule } from './veterinary-services/veterinary-services.module';
import { ServiceReviewsModule } from './service-reviews/service-reviews.module';
import { FavoriteServicesModule } from './favorite-services/favorite-services.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        NODE_ENV: Joi.string()
          .valid('development', 'staging', 'production')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: ALL_ENTITIES,
        autoLoadEntities: true,
        // tabel dibuat/disesuaikan otomatis hanya saat development
        synchronize: config.get<string>('NODE_ENV') === 'development',
      }),
    }),

    UsersModule,
    SpeciesModule,
    BreedsModule,
    PetsModule,
    DiseasesModule,
    QuestionnaireQuestionsModule,
    ScreeningSessionsModule,
    ScreeningAnswersModule,
    ChatMessagesModule,
    ImageScansModule,
    ScreeningResultsModule,
    VeterinaryServicesModule,
    ServiceReviewsModule,
    FavoriteServicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SimpleLoggerMiddleware).forRoutes('*');
  }
}