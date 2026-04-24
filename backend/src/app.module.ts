import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TramitesModule } from './tramites/tramites.module';
import { AuthModule } from './auth/auth.module';
import { Tramite } from './tramites/entities/tramite.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'tramites.db',
      entities: [Tramite],
      synchronize: true,
    }),
    AuthModule,
    TramitesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
