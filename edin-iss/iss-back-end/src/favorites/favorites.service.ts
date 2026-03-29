import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  // Add a recipe to favorites
  async addFavorite(userId: string, recipeId: string) {
    // Check if the recipe exists
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found.`);
    }

    // Check if the favorite already exists by querying the database
    const existingFavorite = await this.prisma.favorite.findFirst({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });

    // If the favorite already exists, do nothing and return
    if (existingFavorite) {
      return; // Do nothing if the favorite is already added
    }

    // Create a new favorite if it doesn't already exist
    return this.prisma.favorite.create({
      data: {
        userId,
        recipeId,
      },
    });
  }

  // Remove a favorite recipe
  async removeFavorite(userId: string, recipeId: string) {
    const favorite = await this.prisma.favorite.findFirst({
      where: {
        userId,
        recipeId,
      },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite not found.`);
    }

    if (favorite.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to remove this favorite.',
      );
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });

    return { message: 'Favorite removed successfully.' };
  }

  // Get all favorite recipes of a user
  async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { recipe: true }, // Include recipe details
    });
  }
}
