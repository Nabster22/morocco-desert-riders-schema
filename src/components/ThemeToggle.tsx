import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';
import { useTranslation } from 'react-i18next';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function ThemeToggle({ variant = 'ghost', size = 'icon', showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {resolvedTheme === 'light' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0, scale: 0 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="h-5 w-5" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, opacity: 0, scale: 0 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="h-5 w-5" />
              </motion.div>
            )}
          </AnimatePresence>
          {showLabel && (
            <span className="ml-2">{t('common.theme')}</span>
          )}
          <span className="sr-only">{t('common.toggleTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <span>{t('common.lightMode')}</span>
          {theme === 'light' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <span>{t('common.darkMode')}</span>
          {theme === 'dark' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Monitor className="h-4 w-4" />
          <span>{t('common.systemMode')}</span>
          {theme === 'system' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="ml-auto w-2 h-2 rounded-full bg-primary"
            />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button (no dropdown)
export function ThemeToggleSimple({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        {resolvedTheme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
