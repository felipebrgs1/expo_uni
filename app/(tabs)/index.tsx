import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900 px-6">
      <View className="bg-sky-500/10 p-6 rounded-3xl items-center border border-sky-500/20">
        <Text className="text-4xl font-black text-sky-600 mb-2">Home</Text>
        <Text className="text-neutral-500 dark:text-neutral-400 text-center text-lg">
          Welcome to your UniWind powered app.
        </Text>
      </View>
      
      <View className="mt-8 flex-row gap-3">
        <View className="bg-sky-500 px-6 py-3 rounded-2xl shadow-lg shadow-sky-500/20">
          <Text className="text-white font-bold text-lg">Getting Started</Text>
        </View>
      </View>
    </View>
  );
}
