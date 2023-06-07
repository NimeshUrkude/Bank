//remix 
import {Links,LiveReload,Meta,Outlet,Scripts,ScrollRestoration} from "@remix-run/react";

//page / components
import Header from "./components/header";
import Footer from "./components/footer";
import rootcss from "./root.css";

//css
export const links = () =>{
  return[
      {
        rel:"stylesheet",
        href:rootcss,
      },
  ];
} 

//function
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{margin:"0px" , padding:"0px"}}>
        <Header/>
        <Outlet />
        <Footer/>
        <ScrollRestoration />
        {process.env.NODE_ENV==="development"?<LiveReload />:null}
        <LiveReload />
      </body>
    </html>
  );
}
