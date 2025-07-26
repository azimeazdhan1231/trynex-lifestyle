import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart';
import { useLanguage } from '@/lib/translations';
import { Link } from 'wouter';

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart, getTotalItems, getTotalPrice } = useCart();
  const { language, t } = useLanguage();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-6 w-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {t.cart}
              </h2>
              {getTotalItems() > 0 && (
                <Badge className="bg-purple-600 text-white">
                  {getTotalItems()}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeCart}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                  {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
                </p>
                <Link href="/products">
                  <Button 
                    onClick={closeCart}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {language === 'bn' ? 'শপিং করুন' : 'Start Shopping'}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <img
                      src={item.image || '/api/placeholder/80/80'}
                      alt={language === 'bn' ? item.nameBn : item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate">
                        {language === 'bn' ? item.nameBn : item.name}
                      </h4>
                      <p className="text-purple-600 font-semibold">
                        ৳{item.price}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ৳{item.price * item.quantity}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 mt-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Checkout */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.total}:
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  ৳{getTotalPrice()}
                </span>
              </div>
              
              <div className="space-y-3">
                <Link href="/checkout">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3"
                    onClick={closeCart}
                  >
                    {t.checkout}
                  </Button>
                </Link>
                
                <Link href="/products">
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={closeCart}
                  >
                    {language === 'bn' ? 'আরও কিনুন' : 'Continue Shopping'}
                  </Button>
                </Link>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                {language === 'bn' 
                  ? 'ডেলিভারি চার্জ চেকআউটে যোগ হবে'
                  : 'Delivery charges will be added at checkout'
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}