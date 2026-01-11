import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Eye, FileDown, Filter, Calendar, User, Mail, Phone, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useBookings, useUpdateBookingStatus, useExportBookingsCSV } from '@/hooks/useApi';

const AdminBookings = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { data: bookingsData, isLoading, isError } = useBookings({ status: statusFilter !== 'all' ? statusFilter : undefined });
  const updateStatus = useUpdateBookingStatus();
  const exportCSV = useExportBookingsCSV();

  const bookings = (bookingsData?.data || []).filter((b: any) => 
    !searchQuery || b.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.tour_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    await updateStatus.mutateAsync({ id: bookingId, status: newStatus });
  };

  const stats = {
    total: bookingsData?.pagination?.total || bookings.length,
    confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
    pending: bookings.filter((b: any) => b.status === 'pending').length,
    revenue: bookings.filter((b: any) => b.status !== 'cancelled').reduce((sum: number, b: any) => sum + (b.total_price || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display font-bold text-xl text-terracotta">MDR Admin</Link>
          <nav className="flex items-center gap-4">
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.dashboard')}</Link>
            <Link to="/admin/tours" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.tours')}</Link>
            <Link to="/admin/bookings" className="text-sm font-medium text-foreground">{t('admin.bookings')}</Link>
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border"><ThemeToggle /><LanguageSwitcher /></div>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Site</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Total Bookings</div><div className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.total}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Confirmed</div><div className="text-3xl font-bold text-green-600">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.confirmed}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Pending</div><div className="text-3xl font-bold text-yellow-600">{isLoading ? <Skeleton className="h-8 w-16" /> : stats.pending}</div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-sm text-muted-foreground">Total Revenue</div><div className="text-3xl font-bold text-terracotta">{isLoading ? <Skeleton className="h-8 w-24" /> : `$${stats.revenue.toLocaleString()}`}</div></CardContent></Card>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-3xl font-bold">Bookings Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search bookings..." className="pl-10 w-64" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select>
            <Button variant="outline" onClick={() => exportCSV.mutate({})} disabled={exportCSV.isPending}>{exportCSV.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />}Export CSV</Button>
          </div>
        </div>

        {isError && <Alert variant="destructive" className="mb-6"><AlertCircle className="h-4 w-4" /><AlertDescription>Failed to load bookings.</AlertDescription></Alert>}

        <Card><CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Reference</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Tour</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Total</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {isLoading ? [1,2,3].map(i => <tr key={i} className="border-b"><td className="py-4 px-6" colSpan={7}><Skeleton className="h-12 w-full" /></td></tr>) :
                bookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-4 px-6"><span className="font-mono text-sm">{booking.reference || `MDR-${booking.id}`}</span></td>
                    <td className="py-4 px-4"><div className="font-medium">{booking.user_name}</div><div className="text-xs text-muted-foreground">{booking.user_email}</div></td>
                    <td className="py-4 px-4">{booking.tour_name}<Badge variant="outline" className="ml-2 capitalize">{booking.tier}</Badge></td>
                    <td className="py-4 px-4"><div className="flex items-center gap-1 text-muted-foreground"><Calendar className="h-4 w-4" />{new Date(booking.start_date).toLocaleDateString()}</div></td>
                    <td className="py-4 px-4"><span className="font-semibold text-terracotta">${booking.total_price}</span></td>
                    <td className="py-4 px-4">
                      <Select value={booking.status} onValueChange={(v) => handleStatusChange(booking.id, v)}>
                        <SelectTrigger className={`w-32 h-8 ${getStatusColor(booking.status)}`}><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="confirmed">Confirmed</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-6 text-right"><Button variant="ghost" size="sm" onClick={() => { setSelectedBooking(booking); setIsDetailDialogOpen(true); }}><Eye className="h-4 w-4 mr-2" />View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent></Card>
      </main>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Booking Details</DialogTitle><DialogDescription>Reference: {selectedBooking?.reference || `MDR-${selectedBooking?.id}`}</DialogDescription></DialogHeader>
          {selectedBooking && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-muted-foreground">Customer</label><div className="flex items-center gap-2 mt-1"><User className="h-4 w-4 text-muted-foreground" />{selectedBooking.user_name}</div></div>
                <div><label className="text-sm font-medium text-muted-foreground">Status</label><div className="mt-1"><Badge className={getStatusColor(selectedBooking.status)}>{selectedBooking.status}</Badge></div></div>
              </div>
              <div><label className="text-sm font-medium text-muted-foreground">Tour</label><p className="mt-1">{selectedBooking.tour_name}</p></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="text-sm font-medium text-muted-foreground">Start Date</label><p className="mt-1">{new Date(selectedBooking.start_date).toLocaleDateString()}</p></div>
                <div><label className="text-sm font-medium text-muted-foreground">Guests</label><p className="mt-1">{selectedBooking.guests}</p></div>
                <div><label className="text-sm font-medium text-muted-foreground">Tier</label><p className="mt-1 capitalize">{selectedBooking.tier}</p></div>
              </div>
              <div><label className="text-sm font-medium text-muted-foreground">Total Amount</label><p className="mt-1 text-2xl font-bold text-terracotta">${selectedBooking.total_price}</p></div>
              {selectedBooking.special_requests && <div><label className="text-sm font-medium text-muted-foreground">Special Requests</label><p className="mt-1 text-sm bg-muted p-3 rounded-lg">{selectedBooking.special_requests}</p></div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
