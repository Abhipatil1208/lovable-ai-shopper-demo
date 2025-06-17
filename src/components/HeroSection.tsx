
import React from 'react';
import { Sparkles, Search } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-60"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full blur-xl opacity-60"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-1 bg-white/70 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">AI-Powered Shopping</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Style with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover personalized fashion recommendations through natural conversations. 
            Just tell us what you're looking for, and our AI will find your perfect match.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Start Shopping</span>
            </button>
            
            <button className="bg-white text-gray-700 px-8 py-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:shadow-md">
              Browse Collection
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 text-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-2xl font-bold text-gray-900">50K+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">AI Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
