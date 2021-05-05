import axios from "axios";

const buildClient = ( { req } ) =>{

  if(typeof window === "undefined") {
    //we are on the server
   console.log("SERVER")
    
   return axios.create({
      baseURL:"http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/",
      headers: req.headers
     });

  } else {
    console.log(req)
    console.log("client")
    //we are on the browser
    return axios.create({
      baseURL: "/"
    });
  }
};

export default buildClient;