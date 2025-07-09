import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Render,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/user.create.dto';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userservice: UsersService,
    private configservice: ConfigService,
  ) {}

  @Get()
  @Render('users')
  @HttpCode(200)
  async GetAllUsers() {
    const users_data = await this.userservice.getAllUsers();
    console.log('Get all users..');
    const podName =
      this.configservice.get<string>('POD_NAME') || 'Pod name not available';
    return { users: users_data, pod_name: `Pod Name: ${podName}` };
  }

  // Handle form submission to create a new user in postgress database
  @Post()
  // this method is explicitly using @Redirect() which will always return a 302 Found HTTP status
  // (the standard status code for redirects),
  // regardless of the @HttpCode(201) decorator
  @HttpCode(201) // Explicitly set status code
  // Redirect to success page
  @Redirect('/success')
  async CreateUser(@Body() user: CreateUserDTO) {
    // Create a new user
    await this.userservice.createUser(user);
    console.log('Create a new user..');
    // Pass url to HBS template
    return { url: `/success?username=${user.username}` };
  }
}
