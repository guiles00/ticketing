import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exsits", async () => {

  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title:"asa",
      price: 20
    })
    
  expect(response.status).toEqual(404);  
});

it("returns a 401 if the user is not authenticated", async () => {

  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title:"asa",
      price: 20
    })
    
    expect(response.status).toEqual(401);  
});

it("returns a 401 if the user does not own a ticket", async () => {

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title:"asa",
      price: 20
    });
    
   await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", global.signin())
      .send({
        title:"asa",
        price: 20
      }).expect(401);
        
});

it("returns a 400 if the user provides an invalid title or price", async () => {

  const cookie = global.signin(); 
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title:"asa",
      price: 20
    });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        price: 20
      }).expect(400)
      
});


it("if the user provides an invalid title or price", async () => {
  const cookie = global.signin(); 
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title:"asa",
      price: 20
    });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title:"neut",
        price: 30
      })
      .expect(200)

      const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

        expect(ticketResponse.body.title).toEqual("neut");
        expect(ticketResponse.body.price).toEqual(30);
});

it("publishes an event", async () =>{
  
  const cookie = global.signin(); 
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title:"asa",
      price: 20
    });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set("Cookie", cookie)
      .send({
        title:"neut",
        price: 30
      })
      .expect(200)
      
  expect(natsWrapper.client.publish).toHaveBeenCalled();
  
})