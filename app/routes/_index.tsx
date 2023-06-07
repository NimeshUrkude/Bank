//navigation 
import {Link } from "@remix-run/react"

//meta
import { V2_MetaFunction } from "@remix-run/react";
export const meta: V2_MetaFunction = () => {
  return [{ title: "Home" }];
};

//function
export default function Index() {
  return (
    <div className="indexDiv">
      <p className="heading">Home</p>
      <div>
        <Link prefetch="render" to="/signin" className="indexLink">Sign-In</Link>
        <Link prefetch="render" to="/signup" className="indexLink">Sign-Up</Link>
      </div>
    </div>
  );
}