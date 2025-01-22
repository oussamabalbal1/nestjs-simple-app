import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './DTO/user.create.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userrepository:Repository<User>){}

    //Create new user
    async createOneUser(user:CreateUserDTO):Promise<User>{
        //before adding a user first check if exist another user with the same email
        const email:string=user.email
        //try to find user by email
        const user_if_exist= await this.userrepository.findOneBy({email})
        //if there is a user with the email throw an exception
        //else store the user in the data base the return it
        if (user_if_exist){
            throw new HttpException(`User already exists.`,HttpStatus.FOUND)
        }
        const user_data = this.userrepository.create(user)
        return this.userrepository.save(user_data);
    }

    async getAllUsers():Promise<User[]>{
        const user_data = await this.userrepository.find()
        return user_data;
    }

}
