import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { RecipesService } from 'src/recipes/recipes.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { CreateRecipeDto } from 'src/recipes/dto/create-recipe.dto';
import { UpdateRecipeDto } from 'src/recipes/dto/update-recipe.dto';
import { UpdatePasswordDto } from 'src/auth/dto/update-password.dto';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { JwtService } from 'src/auth/jwt.service'; // Make sure this path is correct
import { GetUser } from 'src/auth/decorator';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Controller('me')
export class UsersController {
  constructor(
    private readonly recipeService: RecipesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('/')
  async getMe(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['jwt'];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findUserById(decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Exclude the password field from the user object
      const { password, ...userWithoutPassword } = user;

      return res.json(userWithoutPassword);
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('recipes')
  async createRecipe(
    @GetUser() user: User,
    @Body() createRecipeDto: CreateRecipeDto,
  ) {
    return this.recipeService.createRecipe(user.id, createRecipeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('recipe/:id')
  async updateRecipe(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.updateRecipe(id, updateRecipeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-password')
  async updatePassword(
    @Req() req,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(req.user.id, updatePasswordDto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update-user')
  async updateUser(
    @GetUser() user: User, // This gets the user from the request after the JWT guard validates it
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Directly use the user object instead of trying to access user.id separately
    return this.usersService.updateUser(user.id, updateUserDto);
  }
}
