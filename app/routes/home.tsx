//navigation
import { useLocation } from "react-router-dom";

//forms , action data user
import { Form ,useActionData ,Link } from "@remix-run/react";

//redirect control from backedn , action props interface , json converted
import {  ActionArgs , json} from "@remix-run/node";

//backend db
import { checkbalance } from "~/server/routes/checkBalance";
import { addbalance } from "~/server/routes/addBalance";
import {transferbalance} from "~/server/routes/transferBalance";
import { removebalance } from "~/server/routes/removeBalance";

//meta
import { V2_MetaFunction } from "@remix-run/react";
export const meta: V2_MetaFunction = () => {
  return [{ title: "Home" }];
};

//ActionData interface
interface ActionData {
  message: string;
  status: string;
  amount?: number;
}

//action
export async function action({request}:ActionArgs){
    //get data from frontend
    const form = await request.formData();

    //save in variable
    const action   = form.get("_action") as string;
    const token  = form.get("token") as string;

    //check balance 
    if(action==="checkBalance"){

      //save in a data file
        const data = {
            token:token,
        }

         //send data to backend db
        const res = await checkbalance(data);

        //return
        return json(res);
    }
    else if(action==="removeBalance"){

      //save in variable
      const value  = form.get("value") as string;

      //save in a data file
      const data = {
          token:token,
          value:value,
      }

       //send data to backend db
      const res = await removebalance(data);

      //return
      return json(res);
  }
    else if(action==="addBalance"){

        //save in variable
        const value  = form.get("value") as string;

        //save in a data file
        const data = {
            token:token,
            value:value,
        }

         //send data to backend db
        const res = await addbalance(data);

        //return
        return json(res);
    }
    else{

        //save in variable
        const value = form.get("value") as string;
        const user =  form.get("user") as string;

        //save in a data file
        const data = {
            token:token,
            value:value,
            user:user,
        }

         //send data to backend db
        const res = await transferbalance(data);

        //return
        return json(res);
    }

}

//function
export default function Home() {
  //get token from url
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get("token");

  //action data catcher
  const actionData = useActionData<ActionData>();

  return (
    <div className="homeDiv">

      <h1 className="heading">Home</h1>
      
      <Form method="POST" className="form">
        {token && <input type="hidden" name="token" value={token} />}
        <button className="indexLink" name="_action" value="checkBalance" type="submit">Check Balance</button>
      </Form>

      <div className="spaceBreak"/>

      <Form method="POST"  className="form">
        <div className="columDiv">
          <label className="label">Enter Amount</label>
          <input className="input" type="number" name="value"/>
          {token && <input type="hidden" name="token" value={token} />}
        </div>
        <button className="indexLink" name="_action" value="addBalance" type="submit">Add</button>
      </Form>

      <div className="spaceBreak"/>

      <Form method="POST"  className="form">
        <div className="columDiv">
          <label className="label">Enter Amount</label>
          <input className="input" type="number" name="value"/>
          {token && <input type="hidden" name="token" value={token} />}
        </div>
        <button className="indexLink" name="_action" value="removeBalance" type="submit">Remove</button>
      </Form>

      <div className="spaceBreak"/>

      <Form method="POST"  className="form">
        <div className="columDiv">
          {token && <input type="hidden" name="token" value={token} />}
          <label className="label">Enter Amount</label>
          <input className="input" type="number" name="value"/>
        </div>
        <div className="columDiv">
          <label className="label">Enter Email</label>
          <input className="input" type="email" name="user"/>
        </div>
        <button className="indexLink" name="_action" value="transferBalance" type="submit">Transfer</button>
      </Form>

      {actionData ? <p>{actionData.amount}</p> : null}
      {actionData ? <p>{actionData.message}</p> : null}

      <Link to="/">Logout</Link>
    </div>
  );
}
