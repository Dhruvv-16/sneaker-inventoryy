import { useState } from 'react';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SneakerForm } from './SneakerForm';
import { Sneaker, SneakerFormData } from '@/types/sneaker';

interface SneakerTableProps {
  sneakers: Sneaker[];
  onUpdate: (id: string, data: Partial<SneakerFormData>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const SneakerTable = ({ sneakers, onUpdate, onDelete }: SneakerTableProps) => {
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

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = async (sneaker: Sneaker, data: SneakerFormData) => {
    await onUpdate(sneaker.id, data);
  };

  if (sneakers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sneakers found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-sneaker-surface border-border hover:bg-sneaker-surface">
            <TableHead className="text-foreground font-semibold">Name</TableHead>
            <TableHead className="text-foreground font-semibold">Price</TableHead>
            <TableHead className="text-foreground font-semibold">Stock</TableHead>
            <TableHead className="text-foreground font-semibold">Category</TableHead>
            <TableHead className="text-foreground font-semibold">Total Value</TableHead>
            <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sneakers.map((sneaker) => {
            const isLowStock = sneaker.quantity <= 10;
            const totalValue = sneaker.price * sneaker.quantity;

            return (
              <TableRow 
                key={sneaker.id} 
                className="border-border hover:bg-sneaker-surface/50 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  <div className="flex items-center gap-3">
                    {sneaker.image && (
                      <img 
                        src={sneaker.image} 
                        alt={sneaker.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold">{sneaker.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-foreground">
                  {formatCurrency(sneaker.price)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`font-medium ${isLowStock ? 'text-destructive' : 'text-foreground'}`}>
                      {sneaker.quantity}
                    </span>
                    {isLowStock && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getCategoryColor(sneaker.category)}>
                    {sneaker.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-foreground font-medium">
                  {formatCurrency(totalValue)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <SneakerForm
                      sneaker={sneaker}
                      onSubmit={(data) => handleUpdate(sneaker, data)}
                      trigger={
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(sneaker.id)}
                      disabled={deletingId === sneaker.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};