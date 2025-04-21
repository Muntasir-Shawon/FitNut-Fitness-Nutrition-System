import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { TrendingUp, Scale, Dumbbell, Timer, Check } from 'lucide-react-native';

type GoalCategory = 'Weight Loss' | 'Muscle Gain' | 'Endurance';

interface Goal {
  id: number;
  category: GoalCategory;
  title: string;
  target: string;
  progress: number;
  deadline: string;
}

export default function GoalsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>('Weight Loss');

  const goals: Goal[] = [
    {
      id: 1,
      category: 'Weight Loss',
      title: 'Lose Weight',
      target: 'Target: 75kg',
      progress: 65,
      deadline: '2 months left',
    },
    {
      id: 2,
      category: 'Weight Loss',
      title: 'Reduce Body Fat',
      target: 'Target: 15%',
      progress: 40,
      deadline: '3 months left',
    },
    {
      id: 3,
      category: 'Muscle Gain',
      title: 'Increase Bench Press',
      target: 'Target: 100kg',
      progress: 80,
      deadline: '1 month left',
    },
    {
      id: 4,
      category: 'Muscle Gain',
      title: 'Build Arm Size',
      target: 'Target: +2cm',
      progress: 30,
      deadline: '4 months left',
    },
    {
      id: 5,
      category: 'Endurance',
      title: '5K Run Time',
      target: 'Target: 25min',
      progress: 90,
      deadline: '2 weeks left',
    },
    {
      id: 6,
      category: 'Endurance',
      title: 'Weekly Distance',
      target: 'Target: 30km',
      progress: 55,
      deadline: '1 month left',
    },
  ];

  const filteredGoals = goals.filter((goal) => goal.category === selectedCategory);

  const CategoryIcon = {
    'Weight Loss': Scale,
    'Muscle Gain': Dumbbell,
    'Endurance': Timer,
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fitness Goals</Text>
        <Text style={styles.subtitle}>Track your progress</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {Object.keys(CategoryIcon).map((category) => {
          const Icon = CategoryIcon[category as GoalCategory];
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category as GoalCategory)}
            >
              <Icon
                size={20}
                color={selectedCategory === category ? '#fff' : '#666'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.goalsContainer}>
        {filteredGoals.map((goal) => (
          <BlurView key={goal.id} intensity={80} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>{goal.title}</Text>
              <Text style={styles.goalTarget}>{goal.target}</Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${goal.progress}%` },
                    goal.progress >= 100 && styles.progressComplete,
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{goal.progress}%</Text>
            </View>

            <View style={styles.goalFooter}>
              <Text style={styles.deadline}>{goal.deadline}</Text>
              {goal.progress >= 100 && (
                <View style={styles.completeBadge}>
                  <Check size={12} color="#fff" />
                  <Text style={styles.completeText}>Complete</Text>
                </View>
              )}
            </View>
          </BlurView>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Goal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ccc',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#6366f1',
  },
  categoryText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  categoryTextActive: {
    color: '#fff',
  },
  goalsContainer: {
    padding: 20,
    gap: 15,
  },
  goalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  goalHeader: {
    marginBottom: 15,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  goalTarget: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#222',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 4,
  },
  progressComplete: {
    backgroundColor: '#4ade80',
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#fff',
    width: 45,
    textAlign: 'right',
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadline: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ade80',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  completeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#6366f1',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});