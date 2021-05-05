import buildClient from "../api/build-client";
import axios from "axios";

const Index = (props) =>{

  const onClick = async ()=>{
    console.log("click")
    const response = await axios.post("/api/tickets");
    console.log(response.data)
  
      }
  console.log(props);
  return <button onClick={onClick}> click</button>
  //return props.currentUser ? <h1>You Are Sign In</h1>: <h1>You are not Sign In</h1>
}

Index.getInitialProps = async context => {
    console.log("LANDING")
    const client = buildClient(context);
    const { data } = await client.get("/api/users/currentuser");
    
    return data

}

export default Index;