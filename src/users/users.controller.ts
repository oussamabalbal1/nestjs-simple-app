import { Body, Controller, Post } from '@nestjs/common';
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

}
