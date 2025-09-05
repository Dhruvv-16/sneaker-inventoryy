import { TrendingUp, Package, DollarSign, BarChart3, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/sneaker';

interface SneakerDashboardProps {
  stats: DashboardStats;
}

export const SneakerDashboard = ({ stats }: SneakerDashboardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-accent'
    },
    {
      title: 'Total Stock',
      value: stats.totalStock.toString(),
      icon: BarChart3,
      color: 'text-primary'
    },
    {
      title: 'Total Value',
      value: formatCurrency(stats.totalValue),
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'Average Price',
      value: formatCurrency(stats.averagePrice),
      icon: TrendingUp,
      color: 'text-foreground'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sneaker Inventory</h1>
          <p className="text-muted-foreground">Manage your sneaker collection</p>
        </div>
        {stats.lowStockCount > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">
              {stats.lowStockCount} items low in stock
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-sneaker-surface border-border hover:bg-sneaker-surface-hover transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};