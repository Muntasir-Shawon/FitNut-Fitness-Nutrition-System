import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Lock, Smartphone, Mail, Sparkles } from 'lucide-react-native';
import { loginUser } from '../../services/authStorage';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    setErrorMessage('');
    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your Email/Phone and password.');
      return;
    }

    const result = loginUser(identifier, password);
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setErrorMessage(result.error || 'Invalid credentials');
    }
  };

  const handleDemoFill = () => {
    setIdentifier('demo@fitnut.ai');
    setPassword('demo123');
    setErrorMessage('');
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2940&auto=format&fit=crop' }}
        style={StyleSheet.absoluteFill}
      />
      <BlurView intensity={80} style={styles.content}>
        <Text style={styles.title}>FitNut AI</Text>
        <Text style={styles.subtitle}>Sign in with Email or Phone Number</Text>

        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Smartphone size={20} color="#888" />
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

          <View style={styles.inputContainer}>
            <Lock size={20} color="#888" />
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

          <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.demoButton} activeOpacity={0.8} onPress={handleDemoFill}>
            <Sparkles size={16} color="#6366f1" />
            <Text style={styles.demoButtonText}>Quick Fill Demo Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={styles.linkText}>Don't have an account? <Text style={{ fontWeight: 'bold', color: '#fff' }}>Create ID</Text></Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 440,
    padding: 28,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  demoButtonText: {
    color: '#818cf8',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#f87171',
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  linkText: {
    color: '#6366f1',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
});