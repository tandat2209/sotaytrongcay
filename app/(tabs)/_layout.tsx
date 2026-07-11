import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

import { tabDestinations } from "@/bootstrap/navigation";
import { colors, control, typography } from "@/shared/ui/theme";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="today"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { ...typography.label, marginBottom: 2 },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          minHeight: control.tabBarHeight,
          paddingTop: 4,
        },
      }}
    >
      {tabDestinations.map((destination) => (
        <Tabs.Screen
          key={destination.name}
          name={destination.name}
          options={{
            tabBarAccessibilityLabel: destination.label,
            tabBarIcon: ({ color, size }) => (
              <Ionicons color={color} name={destination.icon} size={size} />
            ),
            tabBarLabel: destination.label,
            title: destination.label,
          }}
        />
      ))}
    </Tabs>
  );
}
