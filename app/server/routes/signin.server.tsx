//primsa
import {prisma} from "../prisma.server";

//bcrypt
import bcrypt from "bcrypt";

//jwt 
import jwt from 'jsonwebtoken';

//jwt interface
interface TokenPayload {
  email: string;
}

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

export async function Signin(data:Data){
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
            where: {email},
        });

        //if user exist tell email already used
        if (!findUser) {

            //return invalid email
            return {
                message: "Invalid Email",
                status: "401",
            };
        }

        //check password
        const match : boolean= await bcrypt.compare(password, findUser.password);

        //if password match
        if(match){

            //create token with serret kry and jwt
            const secretKey : string = process.env.SECRET_KEY as string;
            const token : string = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

            //return token
            return {
                message: "User login success",
                status: "200",
                token:token,
            };
        }

        //if password does not match
        else{

            //return error invalid password
            return {
                message: "Invalid Password",
                status: "401",
            };
        }

    }
    //if caucht any error
    catch (error) {

        //return error
        return {
            message: "Error creating user",
            status: "500",
        };
    }
}
