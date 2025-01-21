import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './DTO/user.create.dto';

@Controller('users')
export class UsersController {
    constructor (private readonly userservice:UsersService){};

    //create a new user
    @Post()
    createOneUser(@Body() user:CreateUserDTO){
        return this.userservice.createOneUser(user)
    }


    // @Get('users')
    // @Render('users')
    // listUsers() {
    //   return { users: this.users };
    // }

    //get all users
    @Get()
    @Render('users')
    GetAllUsers(){
        return { users: this.userservice.getAllUsers() }
    }

    

}
