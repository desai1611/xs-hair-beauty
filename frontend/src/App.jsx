import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './components/PublicLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/Home';
import HairServices from './pages/HairServices';
import BeautyServices from './pages/BeautyServices';
import Products from './pages/Products';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import TermsConditions from './pages/TermsConditions';
import NotFound from './pages/NotFound';

import Login from './pages/admin/Login';
import Overview from './pages/admin/Overview';
import BookingsPanel from './pages/admin/BookingsPanel';
import ServicesPanel from './pages/admin/ServicesPanel';
import ProductsPanel from './pages/admin/ProductsPanel';
import GalleryPanel from './pages/admin/GalleryPanel';
import TransformationsPanel from './pages/admin/TransformationsPanel';
import OffersPanel from './pages/admin/OffersPanel';
import ReviewsPanel from './pages/admin/ReviewsPanel';
import SiteMediaPanel from './pages/admin/SiteMediaPanel';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hair-services" element={<HairServices />} />
          <Route path="/beauty-services" element={<BeautyServices />} />
          <Route path="/advanced-beauty" element={<Navigate to="/beauty-services" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="bookings" element={<BookingsPanel />} />
          <Route path="services" element={<ServicesPanel />} />
          <Route path="products" element={<ProductsPanel />} />
          <Route path="gallery" element={<GalleryPanel />} />
          <Route path="transformations" element={<TransformationsPanel />} />
          <Route path="offers" element={<OffersPanel />} />
          <Route path="reviews" element={<ReviewsPanel />} />
          <Route path="media" element={<SiteMediaPanel />} />
        </Route>
      </Routes>
    </>
  );
}
