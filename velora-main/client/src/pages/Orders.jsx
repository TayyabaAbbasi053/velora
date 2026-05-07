// src/pages/Orders.jsx
import Navbar from '../components/Navbar';
import useAuthStore from '../store/authStore';

const Orders = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: '120px', textAlign: 'center' }}>
          <h1>Please login to view your orders</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: '120px' }} className="container">
        <h1 className="section-title gold-text">My Orders</h1>
        <p style={{ textAlign: 'center', padding: '3rem' }}>No orders yet. Start shopping!</p>
      </div>
    </>
  );
};

export default Orders;