import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/user.create.dto';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
    constructor (private readonly userservice:UsersService, private configservice:ConfigService){};

    ConfigService

    //create a new user
    @Post()
    createOneUser(@Body() user:CreateUserDTO){
        console.log('CREATE ONE USER..')
        return this.userservice.createOneUser(user)
    }

    
    @Get()
    @Render('users')
    async GetAllUsers(){
        const users_data = await this.userservice.getAllUsers();
        console.log('GET ALL USERS..')
        const podName = this.configservice.get<string>('POD_NAME') || 'Pod name not available';
        return { users: users_data , pod_name: `Pod Name: ${podName}` }
    }
}
