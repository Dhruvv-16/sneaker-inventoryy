import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit } from 'lucide-react';
import { Sneaker, SneakerFormData } from '@/types/sneaker';

interface SneakerFormProps {
  onSubmit: (data: SneakerFormData) => Promise<void>;
  sneaker?: Sneaker;
  trigger?: React.ReactNode;
}

export const SneakerForm = ({ onSubmit, sneaker, trigger }: SneakerFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<SneakerFormData>({
    defaultValues: sneaker ? {
      name: sneaker.name,
      price: sneaker.price,
      quantity: sneaker.quantity,
      category: sneaker.category,
      image: sneaker.image
    } : {
      name: '',
      price: 0,
      quantity: 0,
      category: 'Running',
      image: ''
    }
  });

  const selectedCategory = watch('category');

  const onFormSubmit = async (data: SneakerFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button className="gap-2">
      {sneaker ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {sneaker ? 'Edit Sneaker' : 'Add Sneaker'}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {sneaker ? 'Edit Sneaker' : 'Add New Sneaker'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Name</Label>
            <Input
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="bg-input border-border text-foreground"
              placeholder="Enter sneaker name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-foreground">Price (INR)</Label>
            <Input
              id="price"
              type="number"
              {...register('price', { 
                required: 'Price is required',
                min: { value: 1, message: 'Price must be greater than 0' }
              })}
              className="bg-input border-border text-foreground"
              placeholder="0"
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity" className="text-foreground">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              {...register('quantity', { 
                required: 'Quantity is required',
                min: { value: 0, message: 'Quantity cannot be negative' }
              })}
              className="bg-input border-border text-foreground"
              placeholder="0"
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value: 'Running' | 'Casual' | 'Basketball') => setValue('category', value)}
            >
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
                <SelectItem value="Basketball">Basketball</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-foreground">Image URL (Optional)</Label>
            <Input
              id="image"
              {...register('image')}
              className="bg-input border-border text-foreground"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : (sneaker ? 'Update' : 'Add')} Sneaker
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};