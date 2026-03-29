import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async createComment(
    userId: string,
    recipeId: string,
    createCommentDto: CreateCommentDto,
  ) {
    return this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        userId,
        recipeId,
      },
    });
  }

  async getCommentsForRecipe(recipeId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { recipeId },
      include: { user: true },
    });

    if (!comments) {
      throw new NotFoundException(
        `No comments found for recipe with ID ${recipeId}`,
      );
    }

    return comments;
  }
}
