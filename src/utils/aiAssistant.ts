
import { Product } from '../contexts/ShoppingContext';

export interface FilterResult {
  products: Product[];
  message: string;
  confidence: number;
}

export class AIShoppingAssistant {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  processQuery(query: string): FilterResult {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Extract price information
    const priceMatch = this.extractPriceRange(normalizedQuery);
    
    // Extract style/sentiment keywords
    const styleKeywords = this.extractStyleKeywords(normalizedQuery);
    
    // Extract category keywords
    const categoryKeywords = this.extractCategoryKeywords(normalizedQuery);
    
    // Extract color keywords
    const colorKeywords = this.extractColorKeywords(normalizedQuery);

    let filteredProducts = [...this.products];
    let filterCriteria: string[] = [];

    // Apply price filter
    if (priceMatch) {
      filteredProducts = filteredProducts.filter(product => 
        product.price >= priceMatch.min && product.price <= priceMatch.max
      );
      filterCriteria.push(`under ₹${priceMatch.max}`);
    }

    // Apply style/sentiment filter
    if (styleKeywords.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        styleKeywords.some(keyword => 
          product.style.includes(keyword) || 
          product.sentiment === keyword ||
          product.tags.includes(keyword)
        )
      );
      filterCriteria.push(styleKeywords.join(', '));
    }

    // Apply category filter
    if (categoryKeywords.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        categoryKeywords.some(keyword => 
          product.category.includes(keyword) ||
          product.tags.includes(keyword)
        )
      );
      filterCriteria.push(categoryKeywords.join(', '));
    }

    // Apply color filter
    if (colorKeywords.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        colorKeywords.some(keyword => 
          product.tags.includes(keyword) ||
          product.name.toLowerCase().includes(keyword)
        )
      );
      filterCriteria.push(`in ${colorKeywords.join(', ')}`);
    }

    // Generate response message
    const message = this.generateResponseMessage(filteredProducts.length, filterCriteria, normalizedQuery);
    
    return {
      products: filteredProducts,
      message,
      confidence: this.calculateConfidence(normalizedQuery, filteredProducts.length)
    };
  }

  private extractPriceRange(query: string): { min: number; max: number } | null {
    // Match patterns like "under 1000", "below 500", "less than 2000"
    const underMatch = query.match(/(?:under|below|less than|<)\s*₹?(\d+)/);
    if (underMatch) {
      return { min: 0, max: parseInt(underMatch[1]) };
    }

    // Match patterns like "above 500", "over 1000", "more than 800"
    const overMatch = query.match(/(?:above|over|more than|>)\s*₹?(\d+)/);
    if (overMatch) {
      return { min: parseInt(overMatch[1]), max: 10000 };
    }

    // Match patterns like "between 500 and 1000"
    const betweenMatch = query.match(/between\s*₹?(\d+)\s*(?:and|to|-)\s*₹?(\d+)/);
    if (betweenMatch) {
      return { min: parseInt(betweenMatch[1]), max: parseInt(betweenMatch[2]) };
    }

    return null;
  }

  private extractStyleKeywords(query: string): string[] {
    const styleTerms = [
      'elegant', 'minimal', 'minimalist', 'bohemian', 'boho', 'casual', 'formal',
      'vintage', 'retro', 'modern', 'classic', 'edgy', 'romantic', 'feminine',
      'professional', 'business', 'party', 'cocktail', 'evening', 'cozy',
      'comfortable', 'luxury', 'premium', 'delicate', 'structured', 'flowy'
    ];

    return styleTerms.filter(term => query.includes(term));
  }

  private extractCategoryKeywords(query: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'dress': ['dress', 'dresses', 'gown', 'frock'],
      'top': ['top', 'tops', 'blouse', 'shirt', 'tee', 't-shirt'],
      'bottom': ['jeans', 'pants', 'trousers', 'skirt', 'shorts'],
      'jacket': ['jacket', 'blazer', 'coat', 'cardigan'],
      'sweater': ['sweater', 'pullover', 'jumper', 'knitwear'],
      'shoes': ['shoes', 'boots', 'heels', 'flats', 'sneakers', 'sandals']
    };

    const foundCategories: string[] = [];
    Object.entries(categoryMap).forEach(([category, terms]) => {
      if (terms.some(term => query.includes(term))) {
        foundCategories.push(category);
      }
    });

    return foundCategories;
  }

  private extractColorKeywords(query: string): string[] {
    const colors = [
      'black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple',
      'orange', 'brown', 'gray', 'grey', 'navy', 'cream', 'beige', 'gold',
      'silver', 'maroon', 'coral', 'mint', 'lavender'
    ];

    return colors.filter(color => query.includes(color));
  }

  private generateResponseMessage(resultCount: number, criteria: string[], originalQuery: string): string {
    if (resultCount === 0) {
      return `I couldn't find any products matching "${originalQuery}". Try adjusting your search criteria or browse our full collection!`;
    }

    if (criteria.length === 0) {
      return `I found ${resultCount} products for you! Here's what I discovered in our collection.`;
    }

    const criteriaText = criteria.join(' ');
    const productText = resultCount === 1 ? 'product' : 'products';
    
    return `Perfect! I found ${resultCount} ${productText} that match your request for ${criteriaText}. These should be exactly what you're looking for! ✨`;
  }

  private calculateConfidence(query: string, resultCount: number): number {
    const hasSpecificTerms = query.split(' ').length > 3;
    const hasResults = resultCount > 0;
    
    if (!hasResults) return 0.3;
    if (hasSpecificTerms && resultCount < 5) return 0.9;
    if (hasSpecificTerms) return 0.8;
    return 0.6;
  }
}
