import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Bot, Send, Sparkles, User } from 'lucide-react-native';
import { getCurrentUser, UserProfile } from '../../services/authStorage';
import { ChatMessage, generateAIResponse } from '../../services/fitnessAI';

export default function ChatScreen() {
  const [user, setUser] = useState<UserProfile>(getCurrentUser());
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const activeUser = getCurrentUser();
    setUser(activeUser);

    const welcomeMessage: ChatMessage = {
      id: 'msg-welcome',
      sender: 'ai',
      text: `👋 Hey ${activeUser.name} (${activeUser.userId})! I'm your AI Fitness & Nutrition Coach.\n\nI have your profile loaded:\n• ${activeUser.gender}, ${activeUser.age} yrs • ${activeUser.weight}kg (${activeUser.height}cm)\n• BMI: ${activeUser.bmi} (${activeUser.bmiCategory})\n• Goal: ${activeUser.primaryGoal}\n• Diet: ${activeUser.dietaryPreference}\n\nWhat would you like advice on today? Choose a quick question below or type your own!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([welcomeMessage]);
  }, []);

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');

    // Generate AI response
    setTimeout(() => {
      const aiReplyText = generateAIResponse(query, user, updatedMessages);
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 400);
  };

  const quickPrompts = [
    { label: '🥗 What food is good for me?', query: 'What food and meals are good for my goal and diet?' },
    { label: '🏋️‍♂️ Suggest my workout routine', query: 'Recommend the best workout routine for my goal and weight' },
    { label: '🔢 Daily Calorie & Protein Target', query: 'Calculate my exact daily calorie and protein targets' },
    { label: '🌅 Breakfast idea for today', query: 'What should I eat for breakfast today?' },
    { label: '🍎 Healthy snack cravings', query: 'What healthy snacks should I eat to avoid bad cravings?' },
    { label: '💧 Hydration & Recovery tips', query: 'How much water and recovery do I need daily?' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.mainWrapper}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.botBadge}>
              <Bot size={22} color="#6366f1" />
            </View>
            <View style={styles.headerTitles}>
              <Text style={styles.title}>FitNut AI Coach</Text>
              <Text style={styles.subtitle}>Personalized for {user.name} ({user.userId})</Text>
            </View>
          </View>

          <View style={styles.userStatsPill}>
            <Text style={styles.statsPillText}>
              {user.gender} • {user.weight}kg • Goal: <Text style={{ color: '#6366f1', fontWeight: 'bold' }}>{user.primaryGoal}</Text>
            </Text>
          </View>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.chipsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
            {quickPrompts.map((p, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.chip}
                activeOpacity={0.7}
                onPress={() => handleSend(p.query)}
              >
                <Sparkles size={14} color="#6366f1" />
                <Text style={styles.chipText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Chat Message Stream */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <View
                key={m.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.userMessageRow : styles.aiMessageRow,
                ]}
              >
                {!isUser && (
                  <View style={styles.aiAvatar}>
                    <Bot size={18} color="#fff" />
                  </View>
                )}

                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text style={[styles.messageText, isUser && styles.userMessageText]}>
                    {m.text}
                  </Text>
                  <Text style={styles.timestamp}>{m.timestamp}</Text>
                </View>

                {isUser && (
                  <View style={styles.userAvatar}>
                    <User size={18} color="#fff" />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        {/* Bottom Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask about food, workouts, calories..."
            placeholderTextColor="#777"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
            onPress={() => handleSend()}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainWrapper: {
    flex: 1,
    maxWidth: 750,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
    backgroundColor: '#0a0a0c',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  botBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: '#fff',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#999',
  },
  userStatsPill: {
    backgroundColor: '#16161a',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#24242a',
  },
  statsPillText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#ccc',
  },
  chipsSection: {
    backgroundColor: '#0a0a0c',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  chipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#16161a',
    borderWidth: 1,
    borderColor: '#27272e',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  chipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#e2e8f0',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  aiMessageRow: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  bubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
  },
  aiBubble: {
    backgroundColor: '#18181b',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  userBubble: {
    backgroundColor: '#4f46e5',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#f1f5f9',
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0a0c',
    borderTopWidth: 1,
    borderTopColor: '#1c1c1e',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#18181b',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#37373f',
    opacity: 0.6,
  },
});
