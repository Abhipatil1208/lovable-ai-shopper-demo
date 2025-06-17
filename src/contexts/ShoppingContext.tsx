
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  style: string[];
  tags: string[];
  sentiment: string;
  description: string;
  rating?: number;
  reviews?: number;
}

interface ShoppingState {
  products: Product[];
  filteredProducts: Product[];
  searchQuery: string;
  filters: {
    category: string;
    priceRange: [number, number];
    style: string[];
  };
  chatHistory: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  products?: Product[];
}

type ShoppingAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'FILTER_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'CLEAR_CHAT' };

const initialState: ShoppingState = {
  products: [],
  filteredProducts: [],
  searchQuery: '',
  filters: {
    category: '',
    priceRange: [0, 10000],
    style: [],
  },
  chatHistory: [],
};

const shoppingReducer = (state: ShoppingState, action: ShoppingAction): ShoppingState => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
        filteredProducts: action.payload,
      };
    case 'FILTER_PRODUCTS':
      return {
        ...state,
        filteredProducts: action.payload,
      };
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };
    case 'ADD_CHAT_MESSAGE':
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload],
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        chatHistory: [],
      };
    default:
      return state;
  }
};

const ShoppingContext = createContext<{
  state: ShoppingState;
  dispatch: React.Dispatch<ShoppingAction>;
} | null>(null);

export const ShoppingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  return (
    <ShoppingContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingContext.Provider>
  );
};

export const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};
