/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { NavigationProvider, useNavigate } from './context/NavigationContext';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNavDrawer } from './components/layout/MobileNavDrawer';
import { SearchModal } from './components/search/SearchModal';
import { MiniCartDrawer } from './components/cart/MiniCartDrawer';
import { ToastContainer } from './components/layout/ToastContainer';
import { SoleBot } from './components/chatbot/SoleBot';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { FindYourPairQuizPage } from './pages/FindYourPairQuizPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPage,
  ReturnsPage,
  ShippingPage,
  SizeGuidePage,
  TermsPage,
} from './pages/StaticPages';
import { CategorySlug } from './types';

const AppContent: React.FC = () => {
  const { currentPath, navigate } = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Dynamic Route Matching
  const renderRoute = () => {
    // Normalise path (remove trailing slash if not root)
    const path = currentPath.length > 1 && currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

    // 1. Home
    if (path === '/' || path === '') {
      return <HomePage />;
    }

    // 2. Shop
    if (path === '/shop') {
      return <ShopPage />;
    }

    // 3. New Arrivals
    if (path === '/new-arrivals') {
      return <ShopPage onlyNew={true} titleOverride="DROP 001 ARRIVALS" />;
    }

    // 4. Best Sellers
    if (path === '/best-sellers') {
      return <ShopPage onlyBestSeller={true} titleOverride="BEST SELLERS" />;
    }

    // 5. Sale
    if (path === '/sale') {
      return <ShopPage onlySale={true} titleOverride="SALE HEAT" />;
    }

    // 6. Categories: /categories/:slug
    if (path.startsWith('/categories/')) {
      const categorySlug = path.replace('/categories/', '') as CategorySlug;
      return <ShopPage key={categorySlug} initialCategory={categorySlug} />;
    }

    // 7. Collections: /collections/:slug
    if (path.startsWith('/collections/')) {
      return <ShopPage />;
    }

    // 8. Product Detail: /products/:slug
    if (path.startsWith('/products/')) {
      const slug = path.replace('/products/', '');
      return <ProductDetailPage slug={slug} />;
    }

    // 9. Search Results: /search
    if (path.startsWith('/search')) {
      return <SearchResultsPage />;
    }

    // 10. Find Your Pair Quiz: /find-your-pair
    if (path === '/find-your-pair') {
      return <FindYourPairQuizPage />;
    }

    // 11. Shopping Cart: /cart
    if (path === '/cart') {
      return <CartPage />;
    }

    // 12. Wishlist: /wishlist
    if (path === '/wishlist') {
      return <WishlistPage />;
    }

    // 13. Checkout: /checkout
    if (path === '/checkout') {
      return <CheckoutPage />;
    }

    // 14. Order Confirmation: /order-confirmation/:orderId
    if (path.startsWith('/order-confirmation/')) {
      const orderId = path.replace('/order-confirmation/', '');
      return <OrderConfirmationPage orderId={orderId} />;
    }

    // 15. Track Order: /track-order
    if (path.startsWith('/track-order')) {
      return <TrackOrderPage />;
    }

    // 16. My Orders: /my-orders
    if (path === '/my-orders') {
      return <MyOrdersPage />;
    }

    // 17. Size Guide: /size-guide
    if (path === '/size-guide') {
      return <SizeGuidePage />;
    }

    // 18. About: /about
    if (path === '/about') {
      return <AboutPage />;
    }

    // 19. Contact: /contact
    if (path === '/contact') {
      return <ContactPage />;
    }

    // 20. Shipping: /shipping
    if (path === '/shipping') {
      return <ShippingPage />;
    }

    // 21. Returns: /returns
    if (path === '/returns') {
      return <ReturnsPage />;
    }

    // 22. FAQ: /faq
    if (path === '/faq') {
      return <FaqPage />;
    }

    // 23. Privacy: /privacy
    if (path === '/privacy') {
      return <PrivacyPage />;
    }

    // 24. Terms: /terms
    if (path === '/terms') {
      return <TermsPage />;
    }

    // 404 Fallback
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <span className="text-6xl font-black font-display text-[#C8FF35] block">404</span>
        <h2 className="text-2xl font-bold font-display text-white">
          Drop Lost In Transit
        </h2>
        <p className="text-xs text-stone-400 max-w-sm mx-auto">
          The requested page &quot;{path}&quot; does not exist in the SOLEVERSE vault.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-xs uppercase shadow-lg shadow-[#C8FF35]/15 transition-transform active:scale-95"
        >
          Return Home
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E0D12] text-[#FAF8F4] antialiased selection:bg-[#C8FF35] selection:text-[#0E0D12]">
      {/* 1. Announcement Bar & Header Container (scrolls naturally with page content) */}
      <div className="relative z-40 w-full bg-[#17151C]">
        <AnnouncementBar />
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
        />
      </div>

      {/* 2. Main Route Canvas */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Modals, Drawers & Overlays */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onOpenSearch={() => {
          setIsMobileNavOpen(false);
          setIsSearchOpen(true);
        }}
      />

      <MiniCartDrawer />

      {/* 5. Interactive Floating SoleBot (includes direct WhatsApp concierge) */}
      <SoleBot />

      {/* 6. Live Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <NavigationProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </NavigationProvider>
  );
}
