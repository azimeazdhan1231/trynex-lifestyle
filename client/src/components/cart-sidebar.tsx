import { useCart } from '@/lib/cart';
import { useLanguage } from './language-provider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Link } from 'wouter';

export function CartSidebar() {
  const { state, removeItem, updateQuantity, closeCart, getTotalPrice } = useCart();
  const { t } = useLanguage();

  const handleQuantityChange = (id: string, change: number) => {
    const item = state.items.find(item => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + change);
    }
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-96 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{t('cart')}</span>
            <Button variant="ghost" size="sm" onClick={closeCart}>
              <i className="fas fa-times"></i>
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 py-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-shopping-cart text-gray-300 text-4xl mb-4"></i>
                <p className="text-gray-500">আপনার কার্ট খালি</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-mug-hot text-gray-500"></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-neutral">{item.name}</h4>
                      {item.customization && (
                        <p className="text-sm text-gray-600">{item.customization}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-primary">৳{item.price}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-8 h-8 p-0"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <i className="fas fa-minus text-xs"></i>
                          </Button>
                          <span className="font-semibold w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            className="w-8 h-8 p-0"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <i className="fas fa-plus text-xs"></i>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {state.items.length > 0 && (
            <div className="border-t pt-6 space-y-4">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-neutral">{t('total')}:</span>
                <span className="text-2xl font-bold text-primary">৳{getTotalPrice()}</span>
              </div>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full py-3 rounded-full font-semibold">
                  <i className="fas fa-credit-card mr-2"></i>
                  {t('checkout')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
