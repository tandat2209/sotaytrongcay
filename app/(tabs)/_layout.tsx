import { Tabs } from "expo-router";
import { Platform, TouchableOpacity } from "react-native";

import { tabDestinations } from "@/bootstrap/navigation";
import { colors, control, typography } from "@/shared/ui/theme";

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="today"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        ...(Platform.OS === "android"
          ? {
              tabBarButton: ({
                "aria-label": accessibilityLabel,
                "aria-selected": selected,
                children,
                onLongPress,
                onPress,
                style,
                testID,
              }) => (
                <TouchableOpacity
                  accessibilityLabel={accessibilityLabel}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: selected ?? false }}
                  activeOpacity={0.7}
                  {...(onLongPress
                    ? { onLongPress: (event) => onLongPress(event) }
                    : {})}
                  onPress={(event) => onPress?.(event)}
                  style={style}
                  testID={testID}
                >
                  {children}
                </TouchableOpacity>
              ),
            }
          : {}),
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
            tabBarIcon: ({ color, size }) => {
              const Icon = destination.icon;
              return <Icon color={color} size={size} />;
            },
            tabBarLabel: destination.label,
            title: destination.label,
          }}
        />
      ))}
    </Tabs>
  );
}
