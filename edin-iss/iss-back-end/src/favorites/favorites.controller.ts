import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // Add favorite by providing recipeId in the URL
  @UseGuards(JwtAuthGuard)
  @Post(':recipeId') // recipeId is now part of the URL
  async addFavorite(
    @GetUser() user: any, // Extract the full user object
    @Param('recipeId') recipeId: string, // Extract recipeId from the URL
  ) {
    const userId = user.id; // Extract userId from the user object
    return this.favoritesService.addFavorite(userId, recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':recipeId')
  async removeFavorite(
    @GetUser() user: any, // Extract the full user object
    @Param('recipeId') recipeId: string, // Extract recipeId from the URL
  ) {
    const userId = user.id; // Extract userId from the user object
    return this.favoritesService.removeFavorite(userId, recipeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserFavorites(@GetUser() user: any) {
    const userId = user.id; // Extract userId from the user object
    return this.favoritesService.getUserFavorites(userId);
  }
}
