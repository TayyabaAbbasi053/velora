// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Women from './pages/Women';
import Men from './pages/Men';
import HealthAndSkinCare from './pages/HealthAndSkinCare';
import BabyCare from './pages/BabyCare';
import HairCare from './pages/HairCare';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div style={{ background: "#050505", minHeight: "100vh", color: "white" }}>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/women" element={<Women />} />
        <Route path="/women/:subcategory" element={<CategoryPage />} />
        <Route path="/women/:subcategory/:group" element={<CategoryPage />} />
        <Route path="/men" element={<Men />} />
        <Route path="/men/:subcategory" element={<CategoryPage />} />
        <Route path="/health-and-skin-care" element={<HealthAndSkinCare />} />
        <Route path="/baby-care" element={<BabyCare />} />
        <Route path="/hair-care" element={<HairCare />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;