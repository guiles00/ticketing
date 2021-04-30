import axios from "axios";

const Index = (props) =>{

  console.log(props);

  return <h1>Langind y te saludo</h1>
}

Index.getInitialProps = async ({ req }) =>{
  
  const baseURL = "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local";
  
  if(typeof window === undefined){
    
    console.log("entra al server?")
    
  } else {
    console.log(typeof window)
    console.log("entra al browser")
  
  }

return {}
}

export default Index;