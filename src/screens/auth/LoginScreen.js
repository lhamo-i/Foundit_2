import React, { useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthLayout from '../../components/AuthLayout';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { colors, radius, spacing } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const e = {};
    if (!studentId.trim()) e.studentId = 'Enter your student / staff ID';
    if (!password) e.password = 'Enter your password';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const res = await login(studentId, password);
    setLoading(false);
    if (!res.ok) setErrors({ form: res.error });
    // On success AuthContext sets the user and the navigator switches to the app by itself.
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue">
      <CustomInput
        label="Student / Staff ID"
        icon="id-card-outline"
        placeholder="e.g. 02240189"
        value={studentId}
        onChangeText={setStudentId}
        autoCapitalize="none"
        keyboardType="number-pad"
        error={errors.studentId}
      />
      <CustomInput
        label="Password"
        icon="lock-closed-outline"
        placeholder="Your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />

      <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgot} accessibilityRole="button">
        <Text style={styles.link}>Forgot Password?</Text>
      </Pressable>

      {errors.form ? (
        <View style={styles.formError}>
          <Ionicons name="alert-circle" size={18} color={colors.lostText} />
          <Text style={styles.formErrorText}>{errors.form}</Text>
        </View>
      ) : null}

      <CustomButton title="Login" variant="dark" onPress={submit} loading={loading} />

      <View style={styles.orRow}>
        <View style={styles.line} />
        <Text style={styles.or}>or</Text>
        <View style={styles.line} />
      </View>

      <CustomButton
        title="Continue with Google"
        icon="logo-google"
        variant="outline"
        onPress={() => Alert.alert('Coming soon', 'Google sign-in will be added together with Firebase.')}
      />

      <View style={styles.bottomRow}>
        <Text style={styles.muted}>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register')} accessibilityRole="button">
          <Text style={styles.linkBold}>Sign Up</Text>
        </Pressable>
      </View>

      {/* Demo hint, delete this box once Firebase accounts are in place */}
      <View style={styles.demo}>
        <Text style={styles.demoTitle}>Demo account</Text>
        <Text style={styles.demoText}>ID 02240189  ·  password: password123</Text>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.sm, marginBottom: spacing.lg },
  link: { fontSize: 14, color: colors.text, fontWeight: '600', textDecorationLine: 'underline' },
  linkBold: { fontSize: 14, color: colors.text, fontWeight: '700', textDecorationLine: 'underline' },
  muted: { fontSize: 14, color: colors.textMuted },
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.lostBg,
  },
  formErrorText: { flex: 1, marginLeft: spacing.sm, fontSize: 13, color: colors.lostText },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { marginHorizontal: spacing.md, color: colors.textMuted },
  bottomRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  demo: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
    alignItems: 'center',
  },
  demoTitle: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  demoText: { fontSize: 13, color: colors.text, marginTop: 2 },
});
