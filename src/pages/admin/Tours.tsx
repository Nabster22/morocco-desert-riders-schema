import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, MoreHorizontal, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import tourCamel from '@/assets/tour-camel.jpg';
import tourQuad from '@/assets/tour-quad.jpg';
import tourCamp from '@/assets/tour-camp.jpg';

interface Tour {
  id: number;
  name: string;
  city: string;
  category: string;
  duration_days: number;
  price_standard: number;
  price_premium: number;
  is_active: boolean;
  image: string;
}

const initialTours: Tour[] = [
  { id: 1, name: 'Sahara Sunset Camel Trek', city: 'Erfoud', category: 'Camel Trekking', duration_days: 3, price_standard: 299, price_premium: 449, is_active: true, image: tourCamel },
  { id: 2, name: 'Quad Biking Adventure', city: 'Agadir', category: 'Quad Biking', duration_days: 1, price_standard: 89, price_premium: 129, is_active: true, image: tourQuad },
  { id: 3, name: 'Luxury Desert Camp', city: 'Marrakech', category: 'Luxury Camping', duration_days: 2, price_standard: 399, price_premium: 599, is_active: true, image: tourCamp },
  { id: 4, name: 'Dakhla Kitesurfing', city: 'Dakhla', category: 'Watersports', duration_days: 5, price_standard: 599, price_premium: 849, is_active: false, image: tourCamel },
  { id: 5, name: 'Erfoud Fossil Tour', city: 'Erfoud', category: 'Cultural Tours', duration_days: 2, price_standard: 149, price_premium: 229, is_active: true, image: tourQuad },
];

const cities = ['Agadir', 'Dakhla', 'Erfoud', 'Marrakech', 'Ouarzazate'];
const categories = ['Camel Trekking', 'Quad Biking', 'Luxury Camping', 'Watersports', 'Cultural Tours', 'Multi-day Tours'];

const AdminTours = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    category: '',
    duration_days: 1,
    price_standard: 0,
    price_premium: 0,
    description: '',
  });

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = () => {
    if (selectedTour) {
      setTours(tours.map(t => t.id === selectedTour.id ? { ...t, ...formData } : t));
      toast({ title: 'Tour updated', description: `${formData.name} has been updated successfully.` });
    } else {
      const newTour: Tour = {
        id: Date.now(),
        ...formData,
        is_active: true,
        image: tourCamel,
      };
      setTours([...tours, newTour]);
      toast({ title: 'Tour created', description: `${formData.name} has been created successfully.` });
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedTour) {
      setTours(tours.filter(t => t.id !== selectedTour.id));
      toast({ title: 'Tour deleted', description: `${selectedTour.name} has been deleted.` });
    }
    setIsDeleteDialogOpen(false);
    setSelectedTour(null);
  };

  const openEditDialog = (tour: Tour) => {
    setSelectedTour(tour);
    setFormData({
      name: tour.name,
      city: tour.city,
      category: tour.category,
      duration_days: tour.duration_days,
      price_standard: tour.price_standard,
      price_premium: tour.price_premium,
      description: '',
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedTour(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      category: '',
      duration_days: 1,
      price_standard: 0,
      price_premium: 0,
      description: '',
    });
    setSelectedTour(null);
  };

  const toggleActive = (tourId: number) => {
    setTours(tours.map(t => t.id === tourId ? { ...t, is_active: !t.is_active } : t));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display font-bold text-xl text-terracotta">MDR Admin</Link>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.dashboard')}</Link>
            <Link to="/admin/tours" className="text-sm font-medium text-foreground">{t('admin.tours')}</Link>
            <Link to="/admin/bookings" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.bookings')}</Link>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
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
              <Input
                placeholder="Search tours..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="hero" onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tour
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Tour</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Location</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTours.map((tour, index) => (
                    <motion.tr
                      key={tour.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.image}
                            alt={tour.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-foreground">{tour.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{tour.city}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary">{tour.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{tour.duration_days} day{tour.duration_days > 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-terracotta">${tour.price_standard}</div>
                        <div className="text-xs text-muted-foreground">Premium: ${tour.price_premium}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={tour.is_active 
                            ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
                          }
                          onClick={() => toggleActive(tour.id)}
                        >
                          {tour.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/tours/${tour.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditDialog(tour)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => { setSelectedTour(tour); setIsDeleteDialogOpen(true); }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTour ? 'Edit Tour' : 'Create New Tour'}</DialogTitle>
            <DialogDescription>
              {selectedTour ? 'Update the tour information below.' : 'Fill in the details to create a new tour.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Tour Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Sahara Desert Adventure"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.city} onValueChange={(v) => setFormData({ ...formData, city: v })}>
                  <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price_standard">Standard Price ($)</Label>
                <Input
                  id="price_standard"
                  type="number"
                  min="0"
                  value={formData.price_standard}
                  onChange={(e) => setFormData({ ...formData, price_standard: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price_premium">Premium Price ($)</Label>
                <Input
                  id="price_premium"
                  type="number"
                  min="0"
                  value={formData.price_premium}
                  onChange={(e) => setFormData({ ...formData, price_premium: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the tour experience..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={handleCreateOrUpdate}>
              {selectedTour ? 'Update Tour' : 'Create Tour'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tour</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedTour?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Tour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTours;
