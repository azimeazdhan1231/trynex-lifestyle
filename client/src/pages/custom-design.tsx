import { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, Move, Square, Download, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/translations';
import { useCart } from '@/lib/cart';
import { CUSTOM_DESIGN_PRODUCTS } from '@shared/schema';

interface DesignElement {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  image: HTMLImageElement;
  isDragging: boolean;
}

export default function CustomDesignPage() {
  const { language, t } = useLanguage();
  const { addItem } = useCart();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedProduct, setSelectedProduct] = useState<string>('printed-mug');
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [instructions, setInstructions] = useState('');
  
  // Canvas dimensions
  const canvasWidth = 400;
  const canvasHeight = 400;

  useEffect(() => {
    redrawCanvas();
  }, [designElements, selectedProduct]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw product mockup background
    drawProductMockup(ctx);

    // Draw design elements
    designElements.forEach(element => {
      ctx.save();
      
      // Apply transformations
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
      
      // Draw image
      ctx.drawImage(element.image, element.x, element.y, element.width, element.height);
      
      // Draw selection border if selected
      if (selectedElement === element.id) {
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(element.x - 2, element.y - 2, element.width + 4, element.height + 4);
        
        // Draw resize handles
        const handleSize = 8;
        ctx.fillStyle = '#8b5cf6';
        ctx.setLineDash([]);
        ctx.fillRect(element.x - handleSize/2, element.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(element.x + element.width - handleSize/2, element.y - handleSize/2, handleSize, handleSize);
        ctx.fillRect(element.x - handleSize/2, element.y + element.height - handleSize/2, handleSize, handleSize);
        ctx.fillRect(element.x + element.width - handleSize/2, element.y + element.height - handleSize/2, handleSize, handleSize);
      }
      
      ctx.restore();
    });
  };

  const drawProductMockup = (ctx: CanvasRenderingContext2D) => {
    // Create gradient background based on selected product
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    
    switch (selectedProduct) {
      case 'printed-mug':
        gradient.addColorStop(0, '#f3f4f6');
        gradient.addColorStop(1, '#e5e7eb');
        break;
      case 't-shirt':
        gradient.addColorStop(0, '#fef3c7');
        gradient.addColorStop(1, '#fbbf24');
        break;
      case 'water-tumbler':
        gradient.addColorStop(0, '#dbeafe');
        gradient.addColorStop(1, '#3b82f6');
        break;
      default:
        gradient.addColorStop(0, '#f9fafb');
        gradient.addColorStop(1, '#f3f4f6');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw product outline
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    
    const padding = 50;
    ctx.strokeRect(padding, padding, canvasWidth - padding * 2, canvasHeight - padding * 2);
    
    // Add product label
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    const productName = CUSTOM_DESIGN_PRODUCTS[selectedProduct as keyof typeof CUSTOM_DESIGN_PRODUCTS];
    ctx.fillText(
      language === 'bn' ? productName.nameBn : productName.name,
      canvasWidth / 2,
      30
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(language === 'bn' ? 'শুধুমাত্র ছবি ফাইল আপলোড করুন' : 'Please upload only image files');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'bn' ? '৫MB এর চেয়ে ছোট ফাইল আপলোড করুন' : 'Please upload files smaller than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const newElement: DesignElement = {
          id: Date.now().toString(),
          x: 100,
          y: 100,
          width: Math.min(200, img.width),
          height: Math.min(200, (img.height * Math.min(200, img.width)) / img.width),
          rotation: 0,
          image: img,
          isDragging: false,
        };
        
        setDesignElements(prev => [...prev, newElement]);
        setSelectedElement(newElement.id);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if clicking on an element
    for (let i = designElements.length - 1; i >= 0; i--) {
      const element = designElements[i];
      if (x >= element.x && x <= element.x + element.width &&
          y >= element.y && y <= element.y + element.height) {
        setSelectedElement(element.id);
        setIsDragging(true);
        setDragOffset({
          x: x - element.x,
          y: y - element.y,
        });
        return;
      }
    }

    // Click on empty area
    setSelectedElement(null);
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setDesignElements(prev => prev.map(element => {
      if (element.id === selectedElement) {
        return {
          ...element,
          x: Math.max(0, Math.min(canvasWidth - element.width, x - dragOffset.x)),
          y: Math.max(0, Math.min(canvasHeight - element.height, y - dragOffset.y)),
        };
      }
      return element;
    }));
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const rotateSelectedElement = () => {
    if (!selectedElement) return;
    
    setDesignElements(prev => prev.map(element => {
      if (element.id === selectedElement) {
        return { ...element, rotation: (element.rotation + 90) % 360 };
      }
      return element;
    }));
  };

  const resizeSelectedElement = (scale: number) => {
    if (!selectedElement) return;
    
    setDesignElements(prev => prev.map(element => {
      if (element.id === selectedElement) {
        const newWidth = Math.max(50, Math.min(300, element.width * scale));
        const newHeight = Math.max(50, Math.min(300, element.height * scale));
        return { 
          ...element, 
          width: newWidth,
          height: newHeight,
          x: Math.max(0, Math.min(canvasWidth - newWidth, element.x)),
          y: Math.max(0, Math.min(canvasHeight - newHeight, element.y)),
        };
      }
      return element;
    }));
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    
    setDesignElements(prev => prev.filter(element => element.id !== selectedElement));
    setSelectedElement(null);
  };

  const downloadDesign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `trynex-custom-design-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleAddToCart = () => {
    if (designElements.length === 0) {
      alert(language === 'bn' ? 'প্রথমে একটি ডিজাইন আপলোড করুন' : 'Please upload a design first');
      return;
    }

    const productData = CUSTOM_DESIGN_PRODUCTS[selectedProduct as keyof typeof CUSTOM_DESIGN_PRODUCTS];
    
    addItem({
      id: `custom-${selectedProduct}-${Date.now()}`,
      name: productData.name,
      nameBn: productData.nameBn,
      price: productData.price,
      customization: {
        design: 'custom-uploaded'
      }
    });

    alert(language === 'bn' ? 'কার্টে যোগ করা হয়েছে!' : 'Added to cart!');
  };

  const productData = CUSTOM_DESIGN_PRODUCTS[selectedProduct as keyof typeof CUSTOM_DESIGN_PRODUCTS];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            🎨 {t.customDesign}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {language === 'bn' 
              ? 'আপনার নিজস্ব ডিজাইন আপলোড করুন এবং HTML5 ক্যানভাসে লাইভ প্রিভিউ দেখুন। ড্র্যাগ, রিসাইজ এবং রোটেট করুন।'
              : 'Upload your own design and see live preview on HTML5 canvas. Drag, resize, and rotate with precision.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Square className="h-5 w-5 text-purple-600" />
                <span>{language === 'bn' ? 'প্রোডাক্ট নির্বাচন' : 'Select Product'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{language === 'bn' ? 'প্রোডাক্ট টাইপ' : 'Product Type'}</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CUSTOM_DESIGN_PRODUCTS).map(([key, product]) => (
                      <SelectItem key={key} value={key}>
                        {language === 'bn' ? product.nameBn : product.name} - ৳{product.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {language === 'bn' ? productData.nameBn : productData.name}
                </h3>
                <p className="text-2xl font-bold text-purple-600">৳{productData.price}</p>
                <Badge className="mt-2 bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100">
                  {language === 'bn' ? 'কাস্টমাইজেবল' : 'Customizable'}
                </Badge>
              </div>

              <div>
                <Label>{language === 'bn' ? 'বিশেষ নির্দেশনা' : 'Special Instructions'}</Label>
                <Textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder={language === 'bn' 
                    ? 'কোন বিশেষ নির্দেশনা থাকলে লিখুন...'
                    : 'Any special instructions...'}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Canvas Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Move className="h-5 w-5 text-purple-600" />
                  <span>{language === 'bn' ? 'ডিজাইন এডিটর' : 'Design Editor'}</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadDesign}
                    className="hidden sm:flex"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer mx-auto block"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  onMouseLeave={handleCanvasMouseUp}
                />
                
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  {language === 'bn' 
                    ? 'ড্র্যাগ করে ডিজাইন স্থানান্তর করুন'
                    : 'Drag to move design elements'}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Design Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-purple-600" />
                <span>{language === 'bn' ? 'ডিজাইন কন্ট্রোল' : 'Design Controls'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'ডিজাইন আপলোড করুন' : 'Upload Design'}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {language === 'bn' ? 'JPG, PNG ফাইল (সর্বোচ্চ ৫MB)' : 'JPG, PNG files (max 5MB)'}
                </p>
              </div>

              {/* Element Controls */}
              {selectedElement && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <h4 className="font-medium mb-3">
                      {language === 'bn' ? 'নির্বাচিত এলিমেন্ট' : 'Selected Element'}
                    </h4>
                    
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={rotateSelectedElement}
                        className="w-full"
                      >
                        <RotateCw className="h-4 w-4 mr-2" />
                        {language === 'bn' ? 'ঘোরান' : 'Rotate'}
                      </Button>
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resizeSelectedElement(0.8)}
                          className="flex-1"
                        >
                          {language === 'bn' ? 'ছোট' : 'Smaller'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resizeSelectedElement(1.2)}
                          className="flex-1"
                        >
                          {language === 'bn' ? 'বড়' : 'Larger'}
                        </Button>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteSelectedElement}
                        className="w-full"
                      >
                        {language === 'bn' ? 'মুছে ফেলুন' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3"
                  disabled={designElements.length === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                </Button>
                
                {designElements.length === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {language === 'bn' 
                      ? 'প্রথমে একটি ডিজাইন আপলোড করুন'
                      : 'Upload a design first'}
                  </p>
                )}
              </div>

              {/* Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  {language === 'bn' ? 'টিপস:' : 'Tips:'}
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• {language === 'bn' ? 'উচ্চ রেজোলিউশন ছবি ব্যবহার করুন' : 'Use high resolution images'}</li>
                  <li>• {language === 'bn' ? 'PNG ফরম্যাট সবচেয়ে ভালো' : 'PNG format works best'}</li>
                  <li>• {language === 'bn' ? 'ড্র্যাগ করে স্থানান্তর করুন' : 'Drag to move elements'}</li>
                  <li>• {language === 'bn' ? 'ক্লিক করে নির্বাচন করুন' : 'Click to select elements'}</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}