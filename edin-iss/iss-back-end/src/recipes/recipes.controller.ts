import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('/')
  async listAllRecipes() {
    // Call the service method to get all recipes
    return this.recipesService.getAllRecipes();
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-recipes')
  async listMyRecipes(@GetUser() user: User) {
    // Call the service method to get recipes for the authenticated user
    return this.recipesService.getMyRecipes(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('my-recipes/:id')
  async deleteMyRecipe(@GetUser() user: User, @Param('id') recipeId: string) {
    return this.recipesService.deleteMyRecipe(user.id, recipeId);
  }
}
