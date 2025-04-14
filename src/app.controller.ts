
import { Get, Controller, Render, Post, Body, Redirect, Query, Param } from '@nestjs/common';
import { CreateUserDTO } from './users/DTO/user.create.dto';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor (private readonly userservice:UsersService){};


  @Get('register')
  @Render('register')
  showRegistrationForm() {
    const podName = process.env.POD_NAME || 'Pod name not available';
    return {pod_name: `Pod Name: ${podName}`}; // No data needed for the form initially
  }





  // Handle form submission
  @Post('register')
  @Redirect('/success') // Redirects to the success page
  async registerUser(@Body() user: CreateUserDTO) {
      // Log the users (for debugging purposes)
      console.log('Registered Users:', user);
      const data=await this.userservice.createOneUser(user)
      return { url: `/success?username=${user.username}` };
  }
    

  @Get('success')
  @Render('success') // Renders the success.hbs template
  showSuccessPage(@Query('username') username: string) {
    return {username};
  }

}
