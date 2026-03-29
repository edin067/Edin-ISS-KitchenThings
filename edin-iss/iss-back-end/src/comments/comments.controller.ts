import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('recipe/:recipeId')
  async createComment(
    @Param('recipeId') recipeId: string,
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(
      user.id,
      recipeId,
      createCommentDto,
    );
  }

  @Get('recipe/:recipeId')
  async getCommentsForRecipe(@Param('recipeId') recipeId: string) {
    return this.commentsService.getCommentsForRecipe(recipeId);
  }
}
