
import React, { useEffect } from 'react';
import { ShoppingProvider, useShopping } from '../contexts/ShoppingContext';
import { mockProducts } from '../data/products';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import ChatWidget from '../components/ChatWidget';

const IndexContent: React.FC = () => {
  const { dispatch } = useShopping();

  useEffect(() => {
    // Initialize products
    dispatch({ type: 'SET_PRODUCTS', payload: mockProducts });
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection />
      
      {/* Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of trending fashion items. 
              Use our AI assistant to find exactly what you're looking for!
            </p>
          </div>
          
          <ProductGrid />
        </div>
      </section>

      <ChatWidget />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <ShoppingProvider>
      <IndexContent />
    </ShoppingProvider>
  );
};

export default Index;
