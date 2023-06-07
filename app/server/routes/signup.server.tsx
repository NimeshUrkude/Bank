//primsa
import {prisma} from "../prisma.server";

//bcrypt
import bcrypt from "bcrypt";

//data props interface
interface Data{
    email:string;
    password:string;
}

//schema user interface
interface User{
    id:string;
    password:string;
    email:string;
    amount:number;
}

//function
export async function Signup(data:Data){
    //geting data
    const { email, password } = data;

    //email valid 
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {

        //if got invalid email format and return error
        return {
            message: "Invalid email format",
            status: "400",
        };
    }

    //password valid
    if (password.length < 3) {

         //if got password smallet than 3 length and return error
        return {
            message: "Password must be at least 3 characters long",
            status: "400",
        };
    }

    try {
        //check for existing user
        const findUser : User | null = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        //if user exist tell email already used
        if (findUser) {

            //return user already exist
            return {
                message: "User already exists",
                status: "400",
            };
        }

        //create hashed password
        const hashedPassword : string = await bcrypt.hash(password, 10);

        //create new user
        const newUser : User = await prisma.user.create({
            data: {
                email,
                password:hashedPassword,
                amount:0,
            },
        });

        //send new user created
        return {
            message: "Created success",
            status: "201",
        };
    }
    //if caucht any error
    catch (error) {

        //return errors
        return {
            message: "Error creating user",
            status: "500",
        };
    }
}
