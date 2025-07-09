import { Get, Controller, Render, Query, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  // Default page to register a user to postgres database
  @Get()
  @HttpCode(200) // Explicitly set status code
  // Render register front-end page
  @Render('register')
  showRegistrationForm() {
    // Extract pod_name fron evironment variables
    const podName = process.env.POD_NAME || 'Pod name not available';
    // Pass pod_name to HBS template
    return { pod_name: `Pod Name: ${podName}` };
  }

  // Render success page after user creation
  @Get('success')
  @Render('success')
  showSuccessPage(@Query('username') username: string) {
    return { username };
  }

  @Get('health')
  healthc() {
    console.log('Health check..')
    return { status: 'ok' };
  }

}
