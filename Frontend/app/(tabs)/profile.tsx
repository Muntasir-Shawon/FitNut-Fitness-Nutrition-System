import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Settings, ChevronRight, Award, Calendar, TrendingUp, LogOut, User, Activity, Target, Smartphone, Utensils } from 'lucide-react-native';
import { getCurrentUser, logoutUser, UserProfile } from '../../services/authStorage';

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile>(getCurrentUser());

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2940&auto=format&fit=crop' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.userHandle}>{user.userId}</Text>
        <Text style={styles.identifierText}>{user.identifier}</Text>
        
        {/* Key Health Metrics Cards */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.weight}kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.height}cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: '#4ade80' }]}>{user.bmi}</Text>
            <Text style={styles.statLabel}>BMI</Text>
          </View>
        </View>
      </View>

      {/* Health Profile Information Box */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Health Profile</Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Target size={18} color="#6366f1" />
            <Text style={styles.infoLabel}>Primary Goal:</Text>
            <Text style={styles.infoValue}>{user.primaryGoal}</Text>
          </View>

          <View style={styles.infoRow}>
            <Utensils size={18} color="#6366f1" />
            <Text style={styles.infoLabel}>Diet Preference:</Text>
            <Text style={styles.infoValue}>{user.dietaryPreference}</Text>
          </View>

          <View style={styles.infoRow}>
            <Activity size={18} color="#6366f1" />
            <Text style={styles.infoLabel}>Gender & Age:</Text>
            <Text style={styles.infoValue}>{user.gender} • {user.age} yrs</Text>
          </View>

          <View style={styles.infoRow}>
            <Award size={18} color="#4ade80" />
            <Text style={styles.infoLabel}>BMI Category:</Text>
            <Text style={[styles.infoValue, { color: '#4ade80' }]}>{user.bmiCategory}</Text>
          </View>
        </View>
      </View>

      {/* Quick Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App & Training</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/chat')}>
          <Activity size={20} color="#6366f1" />
          <Text style={styles.menuText}>FitNut AI Personal Coach</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/plan')}>
          <Calendar size={20} color="#6366f1" />
          <Text style={styles.menuText}>My Workouts & Meal Plans</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/progress')}>
          <TrendingUp size={20} color="#6366f1" />
          <Text style={styles.menuText}>Progress Analytics</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out ({user.userId})</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    maxWidth: 700,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
    marginBottom: 14,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  name: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: '#fff',
    marginBottom: 2,
  },
  userHandle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#818cf8',
    marginBottom: 4,
  },
  identifierText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#777',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#222',
    width: '90%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#888',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#27272a',
    marginHorizontal: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#fff',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#222',
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#888',
  },
  infoValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    marginLeft: 'auto',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e1e24',
  },
  menuText: {
    flex: 1,
    marginLeft: 14,
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 14,
    gap: 10,
  },
  logoutText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#ef4444',
  },
});