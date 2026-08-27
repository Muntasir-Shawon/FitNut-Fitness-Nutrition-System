import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Lock, Smartphone, User, AtSign, Activity, Target, Utensils, CheckCircle } from 'lucide-react-native';
import { registerUser, calculateBMI } from '../../services/authStorage';

export default function SignUp() {
  // Credentials
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Profile & Identity
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [age, setAge] = useState('24');
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [primaryGoal, setPrimaryGoal] = useState<'Weight Loss' | 'Muscle Gain' | 'Maintenance' | 'Endurance'>('Muscle Gain');
  const [dietaryPreference, setDietaryPreference] = useState<'Standard' | 'High-Protein' | 'Vegetarian' | 'Vegan' | 'Keto'>('High-Protein');

  const [errorMessage, setErrorMessage] = useState('');

  // Live BMI computation
  const { bmi, category: bmiCategory } = useMemo(() => {
    const w = parseFloat(weight) || 0;
    const h = parseFloat(height) || 0;
    return calculateBMI(w, h);
  }, [weight, height]);

  const handleSignUp = () => {
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Please enter an Email or Phone number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!userId.trim()) {
      setErrorMessage('Please create your unique User ID (e.g. alex_fit).');
      return;
    }
    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const numAge = parseInt(age, 10) || 25;
    const numWeight = parseFloat(weight) || 70;
    const numHeight = parseFloat(height) || 170;

    const result = registerUser({
      identifier: identifier.trim(),
      password,
      userId: userId.trim(),
      name: name.trim(),
      gender,
      age: numAge,
      weight: numWeight,
      height: numHeight,
      primaryGoal,
      dietaryPreference,
    });

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.error || 'Failed to create account.');
    }
  };

  const goals = ['Weight Loss', 'Muscle Gain', 'Maintenance', 'Endurance'] as const;
  const diets = ['Standard', 'High-Protein', 'Vegetarian', 'Vegan', 'Keto'] as const;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?q=80&w=2940&auto=format&fit=crop' }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <BlurView intensity={80} style={styles.card}>
          <Text style={styles.title}>Create FitNut Account</Text>
          <Text style={styles.subtitle}>Sign up with Email/Phone & set your custom ID</Text>

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Section 1: Credentials */}
          <Text style={styles.sectionHeading}>1. Login Credentials</Text>
          
          <View style={styles.inputContainer}>
            <Smartphone size={18} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Email or Phone (e.g. +123456789)"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                setErrorMessage('');
              }}
              placeholderTextColor="#777"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Lock size={18} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMessage('');
                }}
                secureTextEntry
                placeholderTextColor="#777"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Lock size={18} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Confirm"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrorMessage('');
                }}
                secureTextEntry
                placeholderTextColor="#777"
              />
            </View>
          </View>

          {/* Section 2: Identity & ID Creation */}
          <Text style={styles.sectionHeading}>2. Create Your Unique Profile ID</Text>
          
          <View style={styles.inputContainer}>
            <AtSign size={18} color="#6366f1" />
            <TextInput
              style={styles.input}
              placeholder="Create User ID (e.g. alex_fitness)"
              value={userId}
              onChangeText={(text) => {
                setUserId(text);
                setErrorMessage('');
              }}
              placeholderTextColor="#777"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <User size={18} color="#888" />
            <TextInput
              style={styles.input}
              placeholder="Full Name (e.g. Alex Johnson)"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrorMessage('');
              }}
              placeholderTextColor="#777"
            />
          </View>

          {/* Section 3: Physical Parameters */}
          <Text style={styles.sectionHeading}>3. Body Stats & Health Metrics</Text>

          {/* Gender Selector */}
          <View style={styles.genderRow}>
            {(['Male', 'Female', 'Other'] as const).map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtn, gender === g && styles.genderBtnActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.genderBtnText, gender === g && styles.genderBtnTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.statInputWrap, { flex: 1 }]}>
              <Text style={styles.statLabel}>Age (yrs)</Text>
              <TextInput
                style={styles.statInput}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                placeholder="24"
                placeholderTextColor="#666"
              />
            </View>

            <View style={[styles.statInputWrap, { flex: 1 }]}>
              <Text style={styles.statLabel}>Height (cm)</Text>
              <TextInput
                style={styles.statInput}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder="175"
                placeholderTextColor="#666"
              />
            </View>

            <View style={[styles.statInputWrap, { flex: 1 }]}>
              <Text style={styles.statLabel}>Weight (kg)</Text>
              <TextInput
                style={styles.statInput}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="70"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {/* Live BMI Banner */}
          <View style={styles.bmiPill}>
            <Activity size={16} color="#4ade80" />
            <Text style={styles.bmiPillText}>
              Calculated BMI: <Text style={{ color: '#fff', fontWeight: 'bold' }}>{bmi}</Text> ({bmiCategory})
            </Text>
          </View>

          {/* Section 4: Goals & Diet */}
          <Text style={styles.sectionHeading}>4. Primary Goal & Diet</Text>

          <Text style={styles.subHeading}>Primary Goal:</Text>
          <View style={styles.pillGroup}>
            {goals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.pill, primaryGoal === g && styles.pillActive]}
                onPress={() => setPrimaryGoal(g)}
              >
                <Text style={[styles.pillText, primaryGoal === g && styles.pillTextActive]}>
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subHeading}>Dietary Preference:</Text>
          <View style={styles.pillGroup}>
            {diets.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.pill, dietaryPreference === d && styles.pillActive]}
                onPress={() => setDietaryPreference(d)}
              >
                <Text style={[styles.pillText, dietaryPreference === d && styles.pillTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Submit */}
          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleSignUp}>
            <CheckCircle size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>Complete Registration & Start</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.linkText}>Already have an ID? <Text style={{ fontWeight: 'bold', color: '#fff' }}>Sign In</Text></Text>
          </TouchableOpacity>
        </BlurView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 500,
    padding: 24,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#818cf8',
    marginTop: 14,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subHeading: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#ccc',
    marginTop: 6,
    marginBottom: 6,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#f87171',
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#16161a',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  genderBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  genderBtnText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#888',
  },
  genderBtnTextActive: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  statInputWrap: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
  },
  statInput: {
    color: '#fff',
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    padding: 0,
  },
  bmiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 10,
  },
  bmiPillText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#4ade80',
  },
  pillGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    backgroundColor: '#16161a',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  pillActive: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  pillText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#888',
  },
  pillTextActive: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  linkText: {
    color: '#6366f1',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});