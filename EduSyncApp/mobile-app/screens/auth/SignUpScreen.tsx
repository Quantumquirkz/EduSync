/**
 * EduSync - Pantalla de Registro de Usuario (SignUpScreen)
 * 
 * Esta pantalla permite a los usuarios crear una nueva cuenta en el sistema EduSync
 * utilizando autenticación de Supabase. Incluye validación de formularios,
 * confirmación de contraseñas y registro con Google OAuth.
 * 
 * Funcionalidades:
 * - Formulario de registro con validación completa
 * - Validación de contraseñas (coincidencia y longitud mínima)
 * - Integración con Supabase Auth para registro
 * - Registro con Google OAuth
 * - Confirmación de email automática
 * - Navegación automática después del registro exitoso
 * 
 * Características de seguridad:
 * - Validación de entrada de usuario
 * - Verificación de contraseñas
 * - Integración con políticas de autenticación de Supabase
 * - Manejo seguro de datos de usuario
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importaciones de React y hooks necesarios
import React, { useState } from 'react';

// Importaciones de componentes de React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

// Importaciones para navegación y área segura
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Importación de iconos
import { Ionicons } from '@expo/vector-icons';

// Importaciones de utilidades y tipos locales
import { toast } from 'sonner-native';
import { RootStackParamList } from '../../App';
import supabase from '../../supabaseClient';

// Tipo para la navegación de esta pantalla
type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

/**
 * Componente principal de la pantalla de registro de usuario
 * 
 * Este componente maneja el proceso de registro de nuevos usuarios
 * mediante Supabase Auth, incluyendo validación de formularios,
 * confirmación de contraseñas y manejo de errores.
 */
export default function SignUpScreen() {
  // Hook de navegación para moverse entre pantallas
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  
  // Estado del formulario con todos los campos necesarios
  const [formData, setFormData] = useState({
    fullName: '',        // Nombre completo del usuario
    email: '',           // Correo electrónico
    password: '',        // Contraseña
    confirmPassword: '', // Confirmación de contraseña
  });
  
  // Estados para manejar la interfaz
  const [loading, setLoading] = useState(false);                    // Estado de carga durante registro
  const [showPassword, setShowPassword] = useState(false);          // Mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Mostrar/ocultar confirmación

  /**
   * Actualiza un campo específico del formulario
   * 
   * @param field - Nombre del campo a actualizar
   * @param value - Nuevo valor del campo
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Valida todos los campos del formulario antes del envío
   * 
   * Verifica que todos los campos obligatorios estén completos,
   * que la contraseña tenga la longitud mínima requerida y
   * que las contraseñas coincidan.
   * 
   * @return boolean - true si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    // Validar nombre completo
    if (!formData.fullName.trim()) {
      toast.error('El nombre completo es requerido');
      return false;
    }
    
    // Validar correo electrónico
    if (!formData.email.trim()) {
      toast.error('El correo electrónico es requerido');
      return false;
    }
    
    // Validar longitud mínima de contraseña
    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }
    
    return true;
  };

  /**
   * Maneja el proceso de registro de usuario
   * 
   * Valida el formulario y utiliza Supabase Auth para crear
   * una nueva cuenta de usuario. Maneja diferentes escenarios
   * como confirmación de email automática.
   */
  const handleSignUp = async () => {
    // Validar formulario antes de proceder
    if (!validateForm()) return;

    setLoading(true); // Activar estado de carga
    try {
      // Intentar registro con Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(), // Metadatos del usuario
          }
        }
      });

      if (error) {
        // Mostrar error de registro
        toast.error(error.message);
      } else {
        // Registro exitoso
        toast.success('¡Cuenta creada exitosamente!');
        
        // Si se devuelve una sesión, navegar directamente
        if (data && 'session' in data && data.session) {
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        } else {
          // Intentar iniciar sesión manualmente
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email.trim(),
            password: formData.password,
          });
          
          if (!loginError && loginData && 'session' in loginData && loginData.session) {
            // Inicio de sesión exitoso, navegar a pantalla principal
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
          } else {
            // Navegar a pantalla de login y solicitar confirmación de email
            navigation.navigate('Login');
            toast('Revisa tu correo para confirmar tu cuenta antes de iniciar sesión');
          }
        }
      }
    } catch (error) {
      // Error de conexión o inesperado
      toast.error('Error de conexión');
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) {
        toast.error(error.message);
        setLoading(false);
      }
      // Supabase will handle redirection
    } catch (err) {
      toast.error('Error al registrar con Google');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Ionicons name="arrow-back" size={24} color="#9C27B0" />
            </TouchableOpacity>
            <Text style={styles.title}>Crear Cuenta</Text>
            <Text style={styles.subtitle}>Únete al sistema de gestión estudiantil</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#9C27B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#666"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#9C27B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9C27B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9C27B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#666"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.googleButton, loading && styles.signUpButtonDisabled]}
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.googleIcon} />
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.termsText}>
              Al crear una cuenta, aceptas nuestros{' '}
              <Text style={styles.termsLink}>Términos de Servicio</Text>
              {' '}y{' '}
              <Text style={styles.termsLink}>Política de Privacidad</Text>
            </Text>
          </View>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  signUpButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  googleButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  googleIcon: {
    marginRight: 8,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#9C27B0',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
  },
  loginLink: {
    color: '#9C27B0',
    fontSize: 14,
    fontWeight: '600',
  },
});