import { Text, View, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-black pt-16 px-6">
      <Text className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">Settings</Text>
      <Text className="text-neutral-500 mb-8">Manage your application preferences</Text>
      
      <View className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
        <View className="flex-row items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-700">
          <Text className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Push Notifications</Text>
          <View className="w-12 h-6 bg-sky-500 rounded-full" />
        </View>
        <View className="flex-row items-center justify-between py-4">
          <Text className="text-lg font-medium text-neutral-800 dark:text-neutral-200">Dark Mode</Text>
          <Text className="text-neutral-400">System Default</Text>
        </View>
      </View>
      
      <View className="mt-6 bg-red-50 dark:bg-red-900/10 rounded-2xl p-4 active:bg-red-100 items-center">
        <Text className="text-red-500 font-semibold text-lg">Sign Out</Text>
      </View>
    </ScrollView>
  );
}
