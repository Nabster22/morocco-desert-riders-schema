import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onLogin = async (data: LoginData) => {
    // Simulate login - in real app, call authAPI.login
    localStorage.setItem('user', JSON.stringify({ email: data.email, role: data.email.includes('admin') ? 'admin' : 'client' }));
    toast({ title: 'Welcome back!', description: 'Login successful' });
    navigate(data.email.includes('admin') ? '/admin' : '/');
  };

  const onRegister = async (data: RegisterData) => {
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, role: 'client' }));
    toast({ title: 'Account created!', description: 'Welcome to Morocco Desert Riders' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-card to-background">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="font-display text-2xl">
                {isRegister ? t('auth.registerTitle') : t('auth.loginTitle')}
              </CardTitle>
              <CardDescription>
                {isRegister ? t('auth.registerSubtitle') : t('auth.loginSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRegister ? (
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <FormField control={registerForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.name')}</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')}</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.password')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} {...field} />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={registerForm.control} name="confirmPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                        <FormControl><Input type="password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" variant="hero" className="w-full">{t('auth.signUp')}</Button>
                  </form>
                </Form>
              ) : (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')}</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.password')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? 'text' : 'password'} {...field} />
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" variant="hero" className="w-full">{t('auth.signIn')}</Button>
                  </form>
                </Form>
              )}
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  {isRegister ? t('auth.hasAccount') : t('auth.noAccount')}
                </span>{' '}
                <button onClick={() => setIsRegister(!isRegister)} className="text-terracotta font-medium hover:underline">
                  {isRegister ? t('auth.signIn') : t('auth.signUp')}
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
