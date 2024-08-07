import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { LucideMoon, LucideSun } from 'lucide-react';
import { useEffect } from 'react';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        if (theme === 'system') {
        }
    }, [theme]);
// Because it detects what's default on system, putting this useEffect prevents the react hydration error


    return (
        <Button onClick={toggleTheme}>
            {theme === 'light' ? <LucideSun /> : <LucideMoon />} 
        </Button>
    );
};

export default ThemeToggle;