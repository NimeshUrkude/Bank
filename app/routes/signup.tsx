//remix
import { Form ,Link,useActionData } from "@remix-run/react";
import { redirect , ActionArgs , json} from "@remix-run/node";

//backend db
import  {Signup} from "../server/routes/signup.server";

//meta
import { V2_MetaFunction } from "@remix-run/react";
export const meta: V2_MetaFunction = () => {
  return [{ title: "SignUp" }];
};


//action
export async function action({request}:ActionArgs){
  //get data from frontend
  const form = await request.formData();

  //save in variable
  const email = form.get("email");
  const password = form.get("password");

  //save in a data file with check all strings
  const data = {
    email: typeof email === "string" ? email : "",
    password: typeof password === "string" ? password : "",
  }

  //send data to backend db
  const res = await Signup(data);

  //check for success and redirect to home
  if(res.message==="Created success"){
    return redirect("/");
  }

  //else show error
  return json(res.message);
}



//function
export default function SignUp() {
  //action data catcher
  const actionData = useActionData<typeof action>();

  return (
    <div className="indexDiv">
      <p className="heading">SignUp</p>
      <Form method="POST" className="form">
        <label className="label">Email</label>
        <input className="input" type="email" name="email"/>

        <label className="label">Password</label>
        <input className="input" type="password" name="password"/>

        <button className="indexLink" type="submit">Submit</button>
      </Form>
      <Link to="/signin">Already have account</Link>
      {actionData ? <p>ERROR: {actionData}</p> : null}
    </div>
  );
}