import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, FileDown, Filter, Calendar, User, Mail, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  reference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tour: string;
  startDate: string;
  guests: number;
  tier: 'standard' | 'premium';
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  specialRequests?: string;
  createdAt: string;
}

const initialBookings: Booking[] = [
  { id: 1, reference: 'MDR-12345678', customerName: 'Sarah Mitchell', customerEmail: 'sarah@example.com', customerPhone: '+1234567890', tour: 'Sahara Sunset Camel Trek', startDate: '2024-12-20', guests: 2, tier: 'premium', total: 898, status: 'confirmed', createdAt: '2024-12-15' },
  { id: 2, reference: 'MDR-87654321', customerName: 'James Kim', customerEmail: 'james@example.com', customerPhone: '+0987654321', tour: 'Quad Biking Adventure', startDate: '2024-12-19', guests: 4, tier: 'standard', total: 356, status: 'pending', specialRequests: 'Need child seats', createdAt: '2024-12-14' },
  { id: 3, reference: 'MDR-11223344', customerName: 'Marie Laurent', customerEmail: 'marie@example.com', customerPhone: '+1122334455', tour: 'Luxury Desert Camp', startDate: '2024-12-18', guests: 2, tier: 'premium', total: 1198, status: 'confirmed', createdAt: '2024-12-12' },
  { id: 4, reference: 'MDR-55667788', customerName: 'Ahmed Hassan', customerEmail: 'ahmed@example.com', customerPhone: '+5566778899', tour: 'Dakhla Kitesurfing', startDate: '2024-12-25', guests: 1, tier: 'standard', total: 599, status: 'pending', createdAt: '2024-12-16' },
  { id: 5, reference: 'MDR-99001122', customerName: 'Emma Wilson', customerEmail: 'emma@example.com', customerPhone: '+9900112233', tour: 'Erfoud Fossil Tour', startDate: '2024-11-15', guests: 3, tier: 'standard', total: 447, status: 'completed', createdAt: '2024-11-10' },
  { id: 6, reference: 'MDR-33445566', customerName: 'Carlos Rodriguez', customerEmail: 'carlos@example.com', customerPhone: '+3344556677', tour: 'Sahara Sunset Camel Trek', startDate: '2024-12-10', guests: 2, tier: 'standard', total: 598, status: 'cancelled', createdAt: '2024-12-01' },
];

const AdminBookings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.tour.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'completed':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-100';
    }
  };

  const updateStatus = (bookingId: number, newStatus: string) => {
    setBookings(bookings.map(b => 
      b.id === bookingId ? { ...b, status: newStatus as Booking['status'] } : b
    ));
    toast({ title: 'Status updated', description: `Booking status changed to ${newStatus}` });
    if (selectedBooking?.id === bookingId) {
      setSelectedBooking({ ...selectedBooking, status: newStatus as Booking['status'] });
    }
  };

  const exportCSV = () => {
    const headers = ['Reference', 'Customer', 'Email', 'Tour', 'Date', 'Guests', 'Tier', 'Total', 'Status'];
    const rows = filteredBookings.map(b => [
      b.reference, b.customerName, b.customerEmail, b.tour, b.startDate, b.guests, b.tier, b.total, b.status
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings.csv';
    a.click();
    toast({ title: 'Export complete', description: 'Bookings exported to CSV' });
  };

  const viewBookingDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailDialogOpen(true);
  };

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    revenue: bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.total, 0),
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
            <Link to="/admin/tours" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.tours')}</Link>
            <Link to="/admin/bookings" className="text-sm font-medium text-foreground">{t('admin.bookings')}</Link>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Site</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Bookings</div>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Confirmed</div>
              <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="text-3xl font-bold text-terracotta">${stats.revenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-3xl font-bold">Bookings Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Reference</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Tour</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Guests</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <span className="font-mono text-sm font-medium">{booking.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">{booking.customerName}</div>
                        <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground">{booking.tour}</span>
                        <Badge variant="outline" className="ml-2 capitalize">{booking.tier}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{booking.startDate}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-muted-foreground">{booking.guests}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-semibold text-terracotta">${booking.total}</span>
                      </td>
                      <td className="py-4 px-4">
                        <Select
                          value={booking.status}
                          onValueChange={(value) => updateStatus(booking.id, value)}
                        >
                          <SelectTrigger className={`w-32 h-8 ${getStatusColor(booking.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewBookingDetails(booking)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedBooking?.reference}
            </DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Customer</label>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedBooking.customerName}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedBooking.status)}>
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedBooking.customerEmail}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedBooking.customerPhone}</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tour</label>
                <p className="mt-1">{selectedBooking.tour}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <p className="mt-1">{selectedBooking.startDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Guests</label>
                  <p className="mt-1">{selectedBooking.guests}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tier</label>
                  <p className="mt-1 capitalize">{selectedBooking.tier}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="mt-1 text-2xl font-bold text-terracotta">${selectedBooking.total}</p>
              </div>
              {selectedBooking.specialRequests && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Special Requests</label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded-lg">{selectedBooking.specialRequests}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
