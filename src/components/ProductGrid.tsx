
import React from 'react';
import ProductCard from './ProductCard';
import { useShopping } from '../contexts/ShoppingContext';
import { Package } from 'lucide-react';

const ProductGrid: React.FC = () => {
  const { state } = useShopping();
  const { filteredProducts } = state;

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
        <p className="text-gray-400 max-w-md">
          Try adjusting your search criteria or chat with our AI assistant for personalized recommendations!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {filteredProducts.map((product, index) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          index={index}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
