import { Text, View, SafeAreaView, Button } from '@/components';
import { useTheme } from '@/components/theme-provider';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const { theme, setTheme } = useTheme();

  return (
    <SafeAreaView>
      <View className="flex-1 p-8 pt-12 bg-background">
        <Text variant="title">Settings</Text>
        <Text variant="caption" className="mb-8">Manage your applications behavior</Text>
        
        <View variant="card" className="mb-4">
          <Text variant="bold" className="mb-4">Appearance</Text>
          <View className="flex-row gap-2">
            <Button 
              label="Light" 
              variant={theme === 'light' ? 'primary' : 'outline'} 
              className="flex-1"
              onPress={() => {
                Alert.alert('Theme', 'Setting to Light');
                setTheme('light');
              }}
            />
            <Button 
              label="Dark" 
              variant={theme === 'dark' ? 'primary' : 'outline'} 
              className="flex-1"
              onPress={() => {
                Alert.alert('Theme', 'Setting to Dark');
                setTheme('dark');
              }}
            />
            <Button 
              label="System" 
              variant={theme === 'system' ? 'primary' : 'outline'} 
              className="flex-1"
              onPress={() => {
                Alert.alert('Theme', 'Setting to System');
                setTheme('system');
              }}
            />
          </View>
        </View>
        
        <View variant="card" className="border-destructive/20 bg-destructive/10">
          <Text className="text-destructive font-bold text-center">Sign Out</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
