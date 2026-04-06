import '../global.css';
import { ThemeProvider as NavigationProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { ThemeProvider, useTheme } from '@/components/theme-provider';
import { View } from '@/components/ui/view';

function RootContent() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <NavigationProvider value={isDark ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }} className="bg-background">
         <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
         </Stack>
      </View>
    </NavigationProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootContent />
    </ThemeProvider>
  );
}
