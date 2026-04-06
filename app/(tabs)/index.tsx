import { Text, View, Button, Input } from '@/components';

export default function HomeScreen() {
  return (
    <View className="flex-1 p-8 pt-20 bg-background">
      <View variant="centered" className="mb-12">
        <Text variant="title" className="text-primary">UniWind UI</Text>
        <Text variant="caption">Themed Design System</Text>
      </View>
      
      <View variant="card" className="mb-6">
        <Text variant="subtitle">Standardized Form</Text>
        <Input label="Email address" placeholder="jane@example.com" className="mt-4" />
        <Input label="Password" placeholder="••••••••" secureTextEntry />
        
        <View className="flex-row gap-3 mt-4">
          <Button label="Login" className="flex-1" />
          <Button label="Cancel" variant="outline" className="flex-1" />
        </View>
      </View>
      
      <View variant="card" className="border-l-4 border-primary">
        <Text variant="bold" className="text-primary">Theme Variables</Text>
        <Text variant="caption" className="mt-1">
          Colors are now managed via CSS variables in global.css, allowing for effortless skinning of the entire app.
        </Text>
      </View>
    </View>
  );
}
