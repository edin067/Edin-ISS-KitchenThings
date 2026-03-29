import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { CommentsModule } from './comments/comments.module';
import { FavoritesModule } from './favorites/favorites.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthModule,
    RecipesModule,
    AuthModule,
    UsersModule,
    RecipesModule,
    PrismaModule,
    CommentsModule,
    FavoritesModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
