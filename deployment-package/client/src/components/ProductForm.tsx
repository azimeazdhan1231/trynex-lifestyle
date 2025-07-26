import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { Product } from '@shared/schema';

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    nameBn: product?.nameBn || '',
    description: product?.description || '',
    descriptionBn: product?.descriptionBn || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    image: product?.image || '/api/placeholder/300/300',
    isCustomizable: product?.isCustomizable || false,
    isFeatured: product?.isFeatured || false,
    inStock: product?.inStock ?? true,
    isActive: product?.isActive ?? true,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      fetch(`/api/admin/products/${product?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(res => res.json()),
    onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Product Name (English)</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="nameBn">Product Name (Bengali)</Label>
          <Input
            id="nameBn"
            value={formData.nameBn}
            onChange={(e) => handleChange('nameBn', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description">Description (English)</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="descriptionBn">Description (Bengali)</Label>
          <Textarea
            id="descriptionBn"
            value={formData.descriptionBn}
            onChange={(e) => handleChange('descriptionBn', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price (৳)</Label>
          <Input
            id="price"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="originalPrice">Original Price (৳)</Label>
          <Input
            id="originalPrice"
            value={formData.originalPrice}
            onChange={(e) => handleChange('originalPrice', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="/api/placeholder/300/300"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isCustomizable"
            checked={formData.isCustomizable}
            onCheckedChange={(checked) => handleChange('isCustomizable', checked)}
          />
          <Label htmlFor="isCustomizable">Customizable</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => handleChange('isFeatured', checked)}
          />
          <Label htmlFor="isFeatured">Featured</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(checked) => handleChange('inStock', checked)}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-save mr-2"></i>
          )}
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}