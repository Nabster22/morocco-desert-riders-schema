import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BarChart3, Users, MapPin, Calendar, TrendingUp, DollarSign, Package, FileDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 12400 }, { month: 'Feb', revenue: 15800 }, { month: 'Mar', revenue: 18200 },
  { month: 'Apr', revenue: 22100 }, { month: 'May', revenue: 28500 }, { month: 'Jun', revenue: 32000 },
];

const bookingsByCity = [
  { name: 'Marrakech', value: 42, color: '#E07A5F' }, { name: 'Erfoud', value: 28, color: '#F4A261' },
  { name: 'Agadir', value: 18, color: '#E9C46A' }, { name: 'Dakhla', value: 12, color: '#2A9D8F' },
];

const recentBookings = [
  { id: 1, tour: 'Sahara Sunset Camel Trek', customer: 'Sarah M.', date: '2024-12-20', amount: 598, status: 'confirmed' },
  { id: 2, tour: 'Quad Biking Adventure', customer: 'James K.', date: '2024-12-19', amount: 178, status: 'pending' },
  { id: 3, tour: 'Luxury Desert Camp', customer: 'Marie L.', date: '2024-12-18', amount: 1198, status: 'confirmed' },
];

const AdminDashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display font-bold text-xl text-terracotta">MDR Admin</Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/admin" className="text-sm font-medium text-foreground">{t('admin.dashboard')}</Link>
            <Link to="/admin/tours" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.tours')}</Link>
            <Link to="/admin/bookings" className="text-sm text-muted-foreground hover:text-foreground">{t('admin.bookings')}</Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to Site</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">{t('admin.dashboard')}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-2" />{t('admin.exportCSV')}</Button>
            <Button variant="outline" size="sm"><FileDown className="h-4 w-4 mr-2" />{t('admin.exportExcel')}</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.totalRevenue')}</p>
                  <p className="text-3xl font-bold">$129,000</p>
                  <p className="text-sm text-green-600 flex items-center gap-1"><TrendingUp className="h-4 w-4" />+12.5%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-terracotta" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.totalBookings')}</p>
                  <p className="text-3xl font-bold">384</p>
                  <p className="text-sm text-green-600 flex items-center gap-1"><TrendingUp className="h-4 w-4" />+8.2%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.totalUsers')}</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-sm text-green-600 flex items-center gap-1"><TrendingUp className="h-4 w-4" />+5.1%</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin.totalTours')}</p>
                  <p className="text-3xl font-bold">35</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle>{t('admin.monthlyRevenue')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Bar dataKey="revenue" fill="hsl(var(--terracotta))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>{t('admin.bookingsByCity')}</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={bookingsByCity} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {bookingsByCity.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader><CardTitle>{t('admin.recentBookings')}</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tour</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr></thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{booking.tour}</td>
                      <td className="py-3 px-4 text-muted-foreground">{booking.customer}</td>
                      <td className="py-3 px-4 text-muted-foreground">{booking.date}</td>
                      <td className="py-3 px-4 font-medium">${booking.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
