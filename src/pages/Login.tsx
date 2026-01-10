import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
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
  const location = useLocation();
  const { toast } = useToast();
  const { login, register, isAuthenticated, isAdmin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  const from = (location.state as any)?.from?.pathname || '/';

  const loginForm = useForm<LoginData>({ 
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });
  
  const registerForm = useForm<RegisterData>({ 
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' }
  });

  const onLogin = async (data: LoginData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({ title: 'Welcome back!', description: 'Login successful' });
      // Check role and redirect accordingly
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      navigate(user.role === 'admin' ? '/admin' : from);
    } catch (error: any) {
      toast({ 
        title: 'Login failed', 
        description: error.message || 'Invalid credentials', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await register({ name: data.name, email: data.email, password: data.password });
      toast({ title: 'Account created!', description: 'Welcome to Morocco Desert Riders' });
      navigate('/');
    } catch (error: any) {
      toast({ 
        title: 'Registration failed', 
        description: error.message || 'Could not create account', 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isRegister ? 50 : -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    },
    exit: { 
      opacity: 0, 
      x: isRegister ? -50 : 50,
      transition: { duration: 0.3 }
    }
  };

  const inputVariants = {
    focus: { scale: 1.02 },
    blur: { scale: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background overflow-hidden">
      <Header />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-terracotta/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-sunset/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-md mx-auto"
        >
          {/* Header Section */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta px-4 py-2 rounded-full text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              {isRegister ? 'Join the adventure' : 'Welcome back'}
            </motion.div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              {isRegister ? 'Create Account' : 'Sign In'}
            </h1>
            <p className="text-muted-foreground">
              {isRegister 
                ? 'Start your desert adventure journey today' 
                : 'Continue your journey with Morocco Desert Riders'}
            </p>
          </motion.div>

          <Card className="border-0 shadow-2xl shadow-foreground/5 backdrop-blur-sm bg-card/80 overflow-hidden">
            {/* Card Gradient Border */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-terracotta/20 via-transparent to-sunset/20 p-[1px]">
              <div className="w-full h-full bg-card rounded-xl" />
            </div>
            
            <CardHeader className="relative pb-2 pt-8">
              {/* Toggle Tabs */}
              <div className="flex bg-muted/50 rounded-lg p-1 mb-2">
                <motion.button
                  onClick={() => setIsRegister(false)}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors relative ${
                    !isRegister ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {!isRegister && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background shadow-sm rounded-md"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t('auth.signIn')}</span>
                </motion.button>
                <motion.button
                  onClick={() => setIsRegister(true)}
                  className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors relative ${
                    isRegister ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {isRegister && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-background shadow-sm rounded-md"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{t('auth.signUp')}</span>
                </motion.button>
              </div>
            </CardHeader>

            <CardContent className="relative pt-4 pb-8">
              <AnimatePresence mode="wait">
                {isRegister ? (
                  <motion.div
                    key="register"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-5">
                        <FormField 
                          control={registerForm.control} 
                          name="name" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">{t('auth.name')}</FormLabel>
                              <FormControl>
                                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    {...field} 
                                    placeholder="John Doe"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-terracotta focus:ring-terracotta/20 transition-all"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-destructive text-xs mt-1" />
                            </FormItem>
                          )} 
                        />
                        
                        <FormField 
                          control={registerForm.control} 
                          name="email" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">{t('auth.email')}</FormLabel>
                              <FormControl>
                                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="email" 
                                    {...field}
                                    placeholder="you@example.com"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-terracotta focus:ring-terracotta/20 transition-all"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-destructive text-xs mt-1" />
                            </FormItem>
                          )} 
                        />
                        
                        <FormField 
                          control={registerForm.control} 
                          name="password" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">{t('auth.password')}</FormLabel>
                              <FormControl>
                                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type={showPassword ? 'text' : 'password'} 
                                    {...field}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-terracotta focus:ring-terracotta/20 transition-all"
                                  />
                                  <motion.button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </motion.button>
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-destructive text-xs mt-1" />
                            </FormItem>
                          )} 
                        />
                        
                        <FormField 
                          control={registerForm.control} 
                          name="confirmPassword" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">{t('auth.confirmPassword')}</FormLabel>
                              <FormControl>
                                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="password" 
                                    {...field}
                                    placeholder="••••••••"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-terracotta focus:ring-terracotta/20 transition-all"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-destructive text-xs mt-1" />
                            </FormItem>
                          )} 
                        />
                        
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button 
                            type="submit" 
                            variant="hero" 
                            className="w-full h-12 text-base font-semibold group"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                {t('auth.signUp')}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    variants={formVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-5">
                        <FormField 
                          control={loginForm.control} 
                          name="email" 
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-foreground font-medium">{t('auth.email')}</FormLabel>
                              <FormControl>
                                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type="email" 
                                    {...field}
                                    placeholder="you@example.com"
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:border-terracotta focus:ring-terracotta/20 transition-all"
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-destructive text-xs mt-1" />
                            </FormItem>
                          )} 
                        />
                        
                        <FormField 
                          control={loginForm.control} 
                          name="password" 
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center justify-between">
                                <FormLabel className="text-foreground font-medium">{t('auth.password')}</FormLabel>
                                <Link 
                                  to="#" 
                                  className="text-xs text-terracotta hover:text-terracotta/80 transition-colors"
                                >
                                  Forgot password?
                                </Link>
                              </div>
                              <FormControl>
                                <motion.div variants={inputVariants} whileFocus="focus" className="relative">
                                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input 
                                    type={showPassword ? 'text' : 'password'} 
                                    {...field}
                                    placeholder="••••••••"
                                    className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-terracotta focus:ring-terracotta/20 transition-all"
                                  />
                                  <motion.button 
                                    type="button" 
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </motion.button>
                                </motion.div>
                              </FormControl>
                              <FormMessage className="text-destructive text-xs mt-1" />
                            </FormItem>
                          )} 
                        />
                        
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <Button 
                            type="submit" 
                            variant="hero" 
                            className="w-full h-12 text-base font-semibold group"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                {t('auth.signIn')}
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </Button>
                        </motion.div>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-card text-muted-foreground">or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border/50 bg-background/50 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 h-11 rounded-lg border border-border/50 bg-background/50 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </motion.button>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Info */}
          <motion.p 
            className="text-center text-xs text-muted-foreground mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            By continuing, you agree to our{' '}
            <Link to="#" className="text-terracotta hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="#" className="text-terracotta hover:underline">Privacy Policy</Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;
