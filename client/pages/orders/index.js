const OrderIndex = ({ orders }) => {

  const listOrders = orders.map((o)=>{
    return <li key={orders.id}>
      {o.ticket.title} - { o.status}
    </li>
  });

  return (<div> 
    <h1>List of Orders</h1>
    {listOrders}
    </div>)
}

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data }
}

export default OrderIndex;