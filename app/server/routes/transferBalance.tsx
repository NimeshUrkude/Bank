//primsa
import {prisma} from "../prisma.server";

//jwt 
import jwt from 'jsonwebtoken';

//jwt interface
interface TokenPayload {
  email: string;
}

//data props interface
interface Data{
    token:string;
    value:string;
    user:string;
}

//schema user interface
interface User{
    id:string;
    password:string;
    email:string;
    amount:number;
}

//function
export async function transferbalance(data:Data){

    //geting data
    const { token , value , user} = data;

    //change value from string to int
    const intvalue : number = parseFloat(value);

   //check token
   let decodedToken : TokenPayload;
    try {
        const secretKey : string = process.env.SECRET_KEY as string;
        decodedToken = jwt.verify(token, secretKey) as TokenPayload;
    }
    catch(err){

        //token not valid
        return {
            message: "Invalid Token Please Re-login",
            status: "401",
            amount:0,
        };
    }

    //get email from token
    const email = decodedToken.email;

    //find user with email
    const findUser : User | null = await prisma.user.findUnique({
        where: {email},
    });

    //if user found
    if(findUser){

        //find other user with email
        const findOtherUser = await prisma.user.findUnique({
            where: {email:user},
        });

        //if found other user found
        if(findOtherUser){

            //check user has insufficient balance
            if(findUser.amount>=intvalue){
                //update user
                const updatedUser : User = await prisma.user.update({
                    where: {email},
                    data: {amount: findUser.amount-intvalue,},
                });

                //update other user
                const updatedOtherUser : User = await prisma.user.update({
                    where:{email:user},
                    data:{amount:findOtherUser.amount+intvalue},
                })

                //return new amount
                return {
                    message: "Balance added successfully",
                    status: "200",
                    amount: updatedUser.amount,
                };
            }

            //user does not have suffient amount
            else{
                return {
                    message: "insufficient Balance",
                    status: "200",
                    amount: findUser.amount,
                };
            }

        }

        //unable to find other user
        else{

            //return error
            return {
                message: "Unknown email",
                status: "404",
                amount:0,
            };
        }
    }

    //unable to find user
    else{

        //return error
        return {
            message: "Unknown email",
            status: "404",
            amount:0,
        };
    }
}
