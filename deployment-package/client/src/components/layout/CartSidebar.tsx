import { Link } from 'wouter';
import { useCart } from '@/lib/cart';
import { useLanguage } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, X } from 'lucide-react';

export default function CartSidebar() {
  const { state, removeItem, updateQuantity, getTotalItems, getTotalPrice, toggleCart, closeCart } = useCart();
  const { language } = useLanguage();

  const deliveryCharge = 60;
  const total = getTotalPrice() + (getTotalPrice() > 0 ? deliveryCharge : 0);

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg" data-testid="cart-sidebar">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
            {getTotalItems() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getTotalItems()}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your cart is empty'}
              </h3>
              <p className="text-gray-500 mb-6">
                {language === 'bn' 
                  ? 'শপিং শুরু করতে কিছু পণ্য যোগ করুন'
                  : 'Add some products to start shopping'
                }
              </p>
              <Link href="/products">
                <Button onClick={closeCart} data-testid="button-browse-products">
                  {language === 'bn' ? 'পণ্য দেখুন' : 'Browse Products'}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" data-testid={`cart-item-${item.id}`}>
                      <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image || '/api/placeholder/300/300'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {language === 'bn' ? item.nameBn : item.name}
                        </h4>
                        <p className="text-purple-600 font-semibold">
                          ৳{item.price.toLocaleString()}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-7 w-7 p-0"
                            data-testid={`button-decrease-${item.id}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="w-8 text-center text-sm font-medium" data-testid={`quantity-${item.id}`}>
                            {item.quantity}
                          </span>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-7 w-7 p-0"
                            data-testid={`button-increase-${item.id}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                            className="h-7 w-7 p-0 ml-auto"
                            data-testid={`button-remove-${item.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold" data-testid={`item-total-${item.id}`}>
                          ৳{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                    <span data-testid="text-subtotal">৳{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                    <span data-testid="text-delivery">৳{deliveryCharge}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>{language === 'bn' ? 'মোট' : 'Total'}</span>
                    <span className="text-lg text-purple-600" data-testid="text-total">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href="/checkout">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={closeCart}
                      data-testid="button-checkout"
                    >
                      {language === 'bn' ? 'চেকআউট' : 'Proceed to Checkout'}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={closeCart}
                    data-testid="button-continue-shopping"
                  >
                    {language === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
                  </Button>
                </div>

                {/* Delivery Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs text-blue-700">
                    <p className="font-medium mb-1">
                      {language === 'bn' ? '📦 ডেলিভারি তথ্য' : '📦 Delivery Info'}
                    </p>
                    <p>
                      {language === 'bn' 
                        ? '• ঢাকায় ১-২ দিন • ঢাকার বাইরে ৩-৪ দিন'
                        : '• Dhaka: 1-2 days • Outside Dhaka: 3-4 days'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}