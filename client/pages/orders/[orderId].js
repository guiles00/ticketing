import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");
 
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method:"post",
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push("/orders")
  });

  useEffect(()=>{
    const findTimeLeft = () => {
      const millys = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(millys / 1000));
    }
    findTimeLeft();
    const timerId = setInterval(findTimeLeft,1000);

    return () => {
      clearInterval(timerId);
    };

  },[]);

  if(timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      {timeLeft} seconds until order expires
      <StripeCheckout
        token={({ id }) => doRequest({ token: id }) }
        stripeKey="pk_test_51IoXsoHQGGEEXHBEKcbeJHpkNtVdBpFv6AF6ra4sALHAslSYPDbSJJ3q1sLx2dnvTr2R9Jf3gJgS6pRmGzzvVZa1000RyaLKHT"
        amount={ order.ticket.price * 100 }
        email={currentUser.email}
      />
      { errors }
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data }
}

export default OrderShow;