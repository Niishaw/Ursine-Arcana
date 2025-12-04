import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { formatDistance, formatOnlineStatus } from "@ursine-arcana/shared";
import type { PublicUserProfile } from "@ursine-arcana/shared";

const { width } = Dimensions.get("window");
const GRID_COLUMNS = 3;
const ITEM_SIZE = (width - 4) / GRID_COLUMNS;

/**
 * Feed Screen - Grindr-style grid of nearby users
 * Sorted by distance (closest first)
 */
export default function FeedScreen() {
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    // TODO: Implement actual API call
    // For now, show placeholder data
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProfiles();
    setRefreshing(false);
  }, [fetchProfiles]);

  const handleProfilePress = (profile: PublicUserProfile) => {
    router.push({
      pathname: "/(main)/user/[id]",
      params: { id: profile.uid },
    });
  };

  const renderProfile = ({ item }: { item: PublicUserProfile }) => {
    const lastActive = item.lastActiveAt
      ? new Date(
          (item.lastActiveAt as unknown as { seconds: number }).seconds * 1000,
        )
      : null;

    return (
      <TouchableOpacity
        onPress={() => handleProfilePress(item)}
        activeOpacity={0.8}
        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
        className="p-0.5"
      >
        <View className="flex-1 bg-surface-secondary rounded-lg overflow-hidden">
          {/* Profile image */}
          {item.profileImageUrl ? (
            <Image
              source={{ uri: item.profileImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center bg-surface-primary">
              <Text className="text-4xl">🐾</Text>
            </View>
          )}

          {/* Overlay with info */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
            {/* Online indicator */}
            {item.isOnline && (
              <View className="absolute top-2 right-2 w-3 h-3 rounded-full bg-status-online" />
            )}

            <Text
              className="text-white font-semibold text-sm"
              numberOfLines={1}
            >
              {item.displayName}
            </Text>

            <Text className="text-text-tertiary text-xs" numberOfLines={1}>
              {item.distance !== null
                ? formatDistance(item.distance)
                : formatOnlineStatus(item.isOnline, lastActive)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary items-center justify-center">
        <Text className="text-text-secondary">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-border-light">
        <Text className="text-2xl font-bold text-text-primary">Explore</Text>
        <TouchableOpacity>
          <Text className="text-2xl">⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Grid */}
      {profiles.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">🐻</Text>
          <Text className="text-xl font-semibold text-text-primary text-center mb-2">
            No one nearby yet
          </Text>
          <Text className="text-text-secondary text-center">
            Enable location to discover people in your area, or check back
            later.
          </Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          renderItem={renderProfile}
          keyExtractor={(item) => item.uid}
          numColumns={GRID_COLUMNS}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#8B5CF6"
            />
          }
          contentContainerStyle={{ paddingVertical: 2 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
