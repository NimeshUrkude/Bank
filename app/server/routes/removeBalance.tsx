//primsa
import { prisma } from "../prisma.server";

//jwt 
import jwt from 'jsonwebtoken';

//jwt interface
interface TokenPayload {
  email: string;
}

//data props interface
interface Data {
  token: string;
  value: string;
}

//schema user interface
interface User{
  id:string;
  password:string;
  email:string;
  amount:number;
}

//function
export async function removebalance(data: Data) {

  //get data
  const { token , value } = data;

  //change value from string to int
  const intvalue : number = parseFloat(value);

  //check token
  let decodedToken : TokenPayload;
  try {
    
    //decode token with jwt and secret Key
    const secretKey : string = process.env.SECRET_KEY as string;
    decodedToken = jwt.verify(token, secretKey) as TokenPayload;
  }
  catch (err) {

    //token not valid
    return {
      message: "Invalid Token Please Re-login",
      status: "401",
      amount:0,
    };
  }

  //get email from token
  const email : string = decodedToken.email;

  //find user with email
  const findUser : User | null = await prisma.user.findUnique({
    where: {email},
  });

  //if user found
  if (findUser) {

    //check sufficient balance
    if(findUser.amount>=intvalue){

      //update user
      const updateUser :User = await prisma.user.update({
        where: {email},
        data: {amount: findUser.amount - intvalue},
      });

      //return new amount
      return {
        message: "Balance added successfully",
        status: "200",
        amount: updateUser.amount,
      };
    }

    //not having sufficient balance
    else{
      //return sufficient balance
      return {
        message: "Insufficient balance",
        status: "200",
        amount: findUser.amount,
      };
    }
  }

  //unable to find email
  else {

    //return error
    return {
      message: "Unknown email",
      status: "404",
      amount:0,
    };
  }
}
