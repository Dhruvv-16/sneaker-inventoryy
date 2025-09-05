import { useState } from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SneakerForm } from './SneakerForm';
import { Sneaker, SneakerFormData } from '@/types/sneaker';

interface SneakerCardProps {
  sneaker: Sneaker;
  onUpdate: (id: string, data: Partial<SneakerFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SneakerCard = ({ sneaker, onUpdate, onDelete }: SneakerCardProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Running':
        return 'bg-accent/20 text-accent border-accent/30';
      case 'Basketball':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Casual':
        return 'bg-sneaker-accent-secondary/20 text-sneaker-accent-secondary border-sneaker-accent-secondary/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  const handleDelete = async () => {
    setDeletingId(sneaker.id);
    try {
      await onDelete(sneaker.id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (data: SneakerFormData) => {
    await onUpdate(sneaker.id, data);
  };

  const isLowStock = sneaker.quantity <= 10;
  const totalValue = sneaker.price * sneaker.quantity;

  return (
    <Card className="bg-sneaker-surface border-border hover:bg-sneaker-surface-hover transition-all duration-300 group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative">
          {sneaker.image ? (
            <img 
              src={sneaker.image} 
              alt={sneaker.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={getCategoryColor(sneaker.category)}>
              {sneaker.category}
            </Badge>
          </div>
          {isLowStock && (
            <div className="absolute top-3 right-3 bg-destructive/90 rounded-full p-1">
              <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {sneaker.name}
            </h3>
            <p className="text-2xl font-bold text-primary mt-1">
              {formatCurrency(sneaker.price)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Stock:</span>
                <span className={`font-semibold ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                  {sneaker.quantity}
                </span>
                {isLowStock && <AlertTriangle className="h-3 w-3 text-destructive" />}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Total Value:</span>
                <span className="font-semibold text-success">
                  {formatCurrency(totalValue)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <SneakerForm
              sneaker={sneaker}
              onSubmit={handleUpdate}
              trigger={
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={handleDelete}
              disabled={deletingId === sneaker.id}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SneakerCardsGridProps {
  sneakers: Sneaker[];
  onUpdate: (id: string, data: Partial<SneakerFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SneakerCardsGrid = ({ sneakers, onUpdate, onDelete }: SneakerCardsGridProps) => {
  if (sneakers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sneakers found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {sneakers.map((sneaker) => (
        <SneakerCard
          key={sneaker.id}
          sneaker={sneaker}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};