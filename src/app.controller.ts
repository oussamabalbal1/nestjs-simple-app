
import { Get, Controller, Render, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {

  private users = [];
  @Get('register')
  @Render('register')
  showRegistrationForm() {
    return {}; // No data needed for the form initially
  }

    // Handle form submission
  @Post('register')
  registerUser(@Body() body: { username: string; email: string; password: string }) {
      const { username, email, password } = body;
  
      // Add user to the array
      this.users.push({ username, email, password });
  
      // Log the users (for debugging purposes)
      console.log('Registered Users:', this.users);
  
      return { message: 'User registered successfully!', users: this.users };
  }
    
  // @Get('users')
  // @Render('users')
  // listUsers() {
  //   return { users: this.users };
  // }
  
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!',name:'oussama',list: ['oussama','ali','abbes'] };
  }
}
