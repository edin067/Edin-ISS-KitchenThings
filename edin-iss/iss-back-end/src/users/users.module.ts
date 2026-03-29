import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { RecipesService } from 'src/recipes/recipes.service';
import { RecipesModule } from 'src/recipes/recipes.module';

@Module({
  imports: [RecipesModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, RecipesService, PrismaService],
})
export class UsersModule {}
