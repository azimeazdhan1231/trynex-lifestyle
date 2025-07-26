import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface PromoOffer {
  id?: string;
  title: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
  showAsPopup: boolean;
  image?: string;
}

interface PromoOfferFormProps {
  offer?: PromoOffer;
  onSuccess: () => void;
}

export function PromoOfferForm({ offer, onSuccess }: PromoOfferFormProps) {
  const [formData, setFormData] = useState({
    title: offer?.title || '',
    titleBn: offer?.titleBn || '',
    description: offer?.description || '',
    descriptionBn: offer?.descriptionBn || '',
    discountPercentage: offer?.discountPercentage || 0,
    validUntil: offer?.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : '',
    isActive: offer?.isActive ?? true,
    showAsPopup: offer?.showAsPopup || false,
    image: offer?.image || '/api/placeholder/400/200',
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      fetch('/api/admin/promo-offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          validUntil: new Date(data.validUntil).toISOString(),
        }),
      }).then(res => res.json()),
    onSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      fetch(`/api/admin/promo-offers/${offer?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          validUntil: new Date(data.validUntil).toISOString(),
        }),
      }).then(res => res.json()),
    onSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offer) {
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
          <Label htmlFor="title">Title (English)</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="titleBn">Title (Bengali)</Label>
          <Input
            id="titleBn"
            value={formData.titleBn}
            onChange={(e) => handleChange('titleBn', e.target.value)}
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
          <Input
            id="discountPercentage"
            type="number"
            value={formData.discountPercentage}
            onChange={(e) => handleChange('discountPercentage', parseInt(e.target.value))}
            min="0"
            max="100"
            required
          />
        </div>
        <div>
          <Label htmlFor="validUntil">Valid Until</Label>
          <Input
            id="validUntil"
            type="date"
            value={formData.validUntil}
            onChange={(e) => handleChange('validUntil', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="/api/placeholder/400/200"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Active</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="showAsPopup"
            checked={formData.showAsPopup}
            onCheckedChange={(checked) => handleChange('showAsPopup', checked)}
          />
          <Label htmlFor="showAsPopup">Show as Popup</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
          {createMutation.isPending || updateMutation.isPending ? (
            <i className="fas fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fas fa-save mr-2"></i>
          )}
          {offer ? 'Update Offer' : 'Create Offer'}
        </Button>
      </div>
    </form>
  );
}