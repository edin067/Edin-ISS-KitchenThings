import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipesService {
  constructor(private prisma: PrismaService) {}

  async createRecipe(userId: string, createRecipeDto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        ownerId: userId,
      },
    });
  }

  async updateRecipe(id: string, updateRecipeDto: UpdateRecipeDto) {
    const recipeExists = await this.prisma.recipe.findUnique({
      where: { id },
    });
    if (!recipeExists) {
      throw new NotFoundException(`Recipe with ID ${id} not found.`);
    }
    const updatedRecipe = await this.prisma.recipe.update({
      where: { id },
      data: updateRecipeDto,
    });
    return updatedRecipe;
  }

  async getAllRecipes() {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        // ownerId: true,
      },
      include: {},
    });

    return recipes;
  }

  async getMyRecipes(userId: string) {
    const recipes = await this.prisma.recipe.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        comments: true, // Include comments if relevant
        favorites: true, // Include favorites if relevant
      },
    });

    if (!recipes || recipes.length === 0) {
      throw new NotFoundException(
        `No recipes found for the user with ID ${userId}.`,
      );
    }

    return recipes;
  }

  async deleteMyRecipe(userId: string, recipeId: string) {
    // Find the recipe first
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
      include: { favorites: true, comments: true }, // Include favorites and comments to ensure they exist
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found.`);
    }

    if (recipe.ownerId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this recipe.',
      );
    }

    // First, delete related favorites
    await this.prisma.favorite.deleteMany({
      where: { recipeId: recipeId },
    });

    // Then, delete related comments
    await this.prisma.comment.deleteMany({
      where: { recipeId: recipeId },
    });

    // Now delete the recipe
    await this.prisma.recipe.delete({
      where: { id: recipeId },
    });

    return {
      message: 'Recipe and related favorites and comments deleted successfully',
    };
  }
}
