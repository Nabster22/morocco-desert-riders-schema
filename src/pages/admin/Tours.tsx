import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, MapPin, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTours, useCities, useCategories, useCreateTour, useUpdateTour, useDeleteTour } from '@/hooks/useApi';
import tourCamel from '@/assets/tour-camel.jpg';

const AdminTours = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', city_id: '', category_id: '', duration_days: 1, price_standard: 0, price_premium: 0, description: '' });

  const { data: toursData, isLoading, isError } = useTours({ search: searchQuery || undefined });
  const { data: citiesData } = useCities();
  const { data: categoriesData } = useCategories();
  const createTour = useCreateTour();
  const updateTour = useUpdateTour();
  const deleteTour = useDeleteTour();

  const tours = toursData?.data || [];
  const cities = citiesData?.data || [];
  const categories = categoriesData?.data || [];

  const handleCreateOrUpdate = async () => {
    const data = { ...formData, city_id: parseInt(formData.city_id), category_id: parseInt(formData.category_id) };
    if (selectedTour) {
      await updateTour.mutateAsync({ id: selectedTour.id, data });
    } else {
      await createTour.mutateAsync(data);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = async () => {
    if (selectedTour) await deleteTour.mutateAsync(selectedTour.id);
    setIsDeleteDialogOpen(false);
    setSelectedTour(null);
  };

  const openEditDialog = (tour: any) => {
    setSelectedTour(tour);
    setFormData({ name: tour.name, city_id: tour.city_id?.toString() || '', category_id: tour.category_id?.toString() || '', duration_days: tour.duration_days, price_standard: tour.price_standard, price_premium: tour.price_premium, description: tour.description || '' });
    setIsDialogOpen(true);
  };

  const resetForm = () => { setFormData({ name: '', city_id: '', category_id: '', duration_days: 1, price_standard: 0, price_premium: 0, description: '' }); setSelectedTour(null); };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl text-terracotta">MDR Admin</Link>
          <nav className="flex items-center gap-4">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.dashboard')}</Link>
            <Link to="/admin/tours" className="text-sm font-medium text-foreground">{t('admin.tours')}</Link>
            <Link to="/admin/bookings" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.bookings')}</Link>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border"><ThemeToggle /><LanguageSwitcher /></div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Site</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-3xl font-bold">Tours Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tours..." className="pl-10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="hero" onClick={() => { resetForm(); setIsDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Tour</Button>
          </div>
        </div>

        {isError && <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>Failed to load tours.</AlertDescription></Alert>}

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tour</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody>
                  {isLoading ? [1,2,3].map(i => <tr key={i} className="border-b"><td className="py-4 px-6" colSpan={6}><Skeleton className="h-12 w-full" /></td></tr>) :
                  tours.map((tour: any) => (
                    <tr key={tour.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-6"><div className="flex items-center gap-3"><img src={tour.images?.[0] || tourCamel} alt={tour.name} className="w-12 h-12 rounded-lg object-cover" /><span className="font-medium">{tour.name}</span></div></td>
                      <td className="py-4 px-4"><div className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{tour.city_name}</div></td>
                      <td className="py-4 px-4"><div className="flex items-center gap-1 text-muted-foreground"><Clock className="h-4 w-4" />{tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}</div></td>
                      <td className="py-4 px-4"><div className="font-medium text-terracotta">${tour.price_standard}</div></td>
                      <td className="py-4 px-4"><Badge className={tour.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>{tour.is_active ? 'Active' : 'Inactive'}</Badge></td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link to={`/tours/${tour.id}`}><Eye className="h-4 w-4 mr-2" />View</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(tour)}><Edit className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedTour(tour); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{selectedTour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Tour Name</Label><Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>City</Label><Select value={formData.city_id} onValueChange={(v) => setFormData({ ...formData, city_id: v })}><SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger><SelectContent>{cities.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label>Category</Label><Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2"><Label>Duration (days)</Label><Input type="number" min="1" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })} /></div>
              <div className="grid gap-2"><Label>Standard Price ($)</Label><Input type="number" min="0" value={formData.price_standard} onChange={(e) => setFormData({ ...formData, price_standard: parseInt(e.target.value) || 0 })} /></div>
              <div className="grid gap-2"><Label>Premium Price ($)</Label><Input type="number" min="0" value={formData.price_premium} onChange={(e) => setFormData({ ...formData, price_premium: parseInt(e.target.value) || 0 })} /></div>
            </div>
            <div className="grid gap-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleCreateOrUpdate} disabled={createTour.isPending || updateTour.isPending}>
              {(createTour.isPending || updateTour.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {selectedTour ? 'Update Tour' : 'Create Tour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Tour</DialogTitle><DialogDescription>Are you sure you want to delete "{selectedTour?.name}"?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDelete} disabled={deleteTour.isPending}>{deleteTour.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTours;
