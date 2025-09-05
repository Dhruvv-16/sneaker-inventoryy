import { useState } from 'react';
import { Grid, List, Filter, Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SneakerDashboard } from '@/components/SneakerDashboard';
import { SneakerTable } from '@/components/SneakerTable';
import { SneakerCardsGrid } from '@/components/SneakerCard';
import { SneakerForm } from '@/components/SneakerForm';
import { useSneakers } from '@/hooks/useSneakers';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { sneakers, loading, addSneaker, updateSneaker, deleteSneaker, getDashboardStats } = useSneakers();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const stats = getDashboardStats();

  const filteredSneakers = sneakers.filter(sneaker => 
    categoryFilter === 'all' || sneaker.category === categoryFilter
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Sneaker Inventory</h1>
              <p className="text-sm text-muted-foreground">Manage your sneaker collection</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <SneakerDashboard stats={stats} />

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-input border-border">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Running">Running</SelectItem>
                  <SelectItem value="Casual">Casual</SelectItem>
                  <SelectItem value="Basketball">Basketball</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredSneakers.length} of {sneakers.length} sneakers
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border bg-card">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('cards')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            <SneakerForm 
              onSubmit={addSneaker}
              trigger={
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Sneaker
                </Button>
              }
            />
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : viewMode === 'table' ? (
            <SneakerTable
              sneakers={filteredSneakers}
              onUpdate={updateSneaker}
              onDelete={deleteSneaker}
            />
          ) : (
            <SneakerCardsGrid
              sneakers={filteredSneakers}
              onUpdate={updateSneaker}
              onDelete={deleteSneaker}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
