import { Text, View, SafeAreaView } from '@/components';
import { useTheme } from '@/components/theme-provider';
import { Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: 'light' as const, icon: 'sunny' as const },
    { name: 'dark' as const, icon: 'moon' as const },
    { name: 'system' as const, icon: 'desktop' as const },
  ];

  return (
    <SafeAreaView>
      <View className="flex-1 p-8 pt-12 bg-background">
        <Text variant="title">Settings</Text>
        <Text variant="caption" className="mb-8">Manage your applications behavior</Text>
        
        <View variant="card" className="mb-4">
          <Text variant="bold" className="mb-4">Appearance</Text>
          <View className="flex-row gap-4">
            {themes.map((t) => (
              <Pressable
                key={t.name}
                onPress={() => setTheme(t.name)}
                className={`flex-1 items-center justify-center py-4 rounded-2xl border-2 ${
                  theme === t.name
                    ? 'bg-primary border-primary'
                    : 'bg-transparent border-border'
                }`}
              >
                <Ionicons
                  name={t.icon}
                  size={24}
                  color={theme === t.name ? '#f8fafc' : '#64748b'}
                />
                <Text
                  className={`mt-2 capitalize ${
                    theme === t.name ? 'text-primary-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {t.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View variant="card" className="border-destructive/20 bg-destructive/10">
          <Text className="text-destructive font-bold text-center">Sign Out</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
