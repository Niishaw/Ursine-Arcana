import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  formatRelativeTime,
  formatMessagePreview,
} from "@ursine-arcana/shared";
import type { ChatListItem } from "@ursine-arcana/shared";

/**
 * Chats Screen - List of conversations
 */
export default function ChatsScreen() {
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement real-time chat list subscription
    setLoading(false);
  }, []);

  const handleChatPress = (chat: ChatListItem) => {
    router.push({
      pathname: "/(main)/chat/[id]",
      params: { id: chat.chatId },
    });
  };

  const renderChat = ({ item }: { item: ChatListItem }) => {
    const lastMessageTime = item.lastMessageAt
      ? new Date(
          (item.lastMessageAt as unknown as { seconds: number }).seconds * 1000,
        )
      : null;

    return (
      <TouchableOpacity
        onPress={() => handleChatPress(item)}
        className="flex-row items-center px-4 py-3 border-b border-border-light"
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="relative">
          {item.otherUser.profileImageUrl ? (
            <Image
              source={{ uri: item.otherUser.profileImageUrl }}
              className="w-14 h-14 rounded-full"
            />
          ) : (
            <View className="w-14 h-14 rounded-full bg-surface-secondary items-center justify-center">
              <Text className="text-2xl">🐾</Text>
            </View>
          )}

          {/* Online indicator */}
          {item.otherUser.isOnline && (
            <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-status-online border-2 border-background-primary" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1 ml-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-text-primary font-semibold text-base">
              {item.otherUser.displayName}
            </Text>
            {lastMessageTime && (
              <Text className="text-text-tertiary text-xs">
                {formatRelativeTime(lastMessageTime)}
              </Text>
            )}
          </View>

          <View className="flex-row items-center mt-1">
            <Text
              className={`flex-1 text-sm ${
                item.unreadCount > 0
                  ? "text-text-primary font-medium"
                  : "text-text-secondary"
              }`}
              numberOfLines={1}
            >
              {item.isLastMessageMine && "You: "}
              {formatMessagePreview(item.lastMessage, "text")}
            </Text>

            {/* Unread badge */}
            {item.unreadCount > 0 && (
              <View className="bg-accent-500 rounded-full min-w-[20px] h-5 items-center justify-center px-1.5 ml-2">
                <Text className="text-white text-xs font-bold">
                  {item.unreadCount > 99 ? "99+" : item.unreadCount}
                </Text>
              </View>
            )}
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
      <View className="px-4 py-3 border-b border-border-light">
        <Text className="text-2xl font-bold text-text-primary">Chats</Text>
      </View>

      {/* Chat list */}
      {chats.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">💬</Text>
          <Text className="text-xl font-semibold text-text-primary text-center mb-2">
            No conversations yet
          </Text>
          <Text className="text-text-secondary text-center">
            Start chatting by tapping on someone in the Explore tab.
          </Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          renderItem={renderChat}
          keyExtractor={(item) => item.chatId}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
