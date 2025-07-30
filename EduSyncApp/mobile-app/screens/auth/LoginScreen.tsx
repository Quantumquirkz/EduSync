/**
 * EduSync - Pantalla de Inicio de Sesión (LoginScreen)
 * 
 * Esta pantalla permite a los usuarios iniciar sesión en el sistema EduSync
 * utilizando autenticación de Supabase. Soporta tanto autenticación por
 * email/password como inicio de sesión con Google OAuth.
 * 
 * Funcionalidades:
 * - Formulario de inicio de sesión con email y contraseña
 * - Validación de campos obligatorios
 * - Integración con Supabase Auth
 * - Inicio de sesión con Google OAuth
 * - Manejo de estados de carga y errores
 * - Navegación automática después del login exitoso
 * 
 * Características de seguridad:
 * - Validación de entrada de usuario
 * - Manejo seguro de credenciales
 * - Integración con políticas de autenticación de Supabase
 * - Redirección segura después de autenticación
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
  Image,
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
type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/**
 * Componente principal de la pantalla de inicio de sesión
 * 
 * Este componente maneja la autenticación de usuarios mediante
 * Supabase Auth, incluyendo validación de formularios y manejo
 * de errores de autenticación.
 */
export default function LoginScreen() {
  // Hook de navegación para moverse entre pantallas
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  // Estados para manejar el formulario y la interfaz
  const [email, setEmail] = useState('');           // Email del usuario
  const [password, setPassword] = useState('');     // Contraseña del usuario
  const [loading, setLoading] = useState(false);    // Estado de carga durante autenticación
  const [showPassword, setShowPassword] = useState(false); // Mostrar/ocultar contraseña

  /**
   * Maneja el proceso de inicio de sesión con email y contraseña
   * 
   * Valida los campos del formulario y utiliza Supabase Auth
   * para autenticar al usuario. Maneja diferentes escenarios
   * como confirmación de email pendiente.
   */
  const handleLogin = async () => {
    // Validación de campos obligatorios
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setLoading(true); // Activar estado de carga
    try {
      // Intentar autenticación con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), // Eliminar espacios en blanco
        password,
      });

      if (error) {
        // Mostrar error de autenticación
        toast.error(error.message);
      } else if (data && 'session' in data && data.session) {
        // Autenticación exitosa con sesión válida
        toast.success('¡Bienvenido de vuelta!');
        // Navegar a la pantalla principal y resetear el stack de navegación
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        // Sesión no disponible, probablemente confirmación pendiente
        toast('Inicia sesión completada. Si no ves la pantalla principal, revisa tu correo para confirmar la cuenta');
      }
    } catch (error) {
      // Error de conexión o inesperado
      toast.error('Error de conexión');
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  /**
   * Maneja el inicio de sesión con Google OAuth
   * 
   * Utiliza Supabase Auth para iniciar el flujo de autenticación
   * con Google. En caso de éxito, Supabase manejará la redirección.
   */
  const handleGoogleSignIn = async () => {
    setLoading(true); // Activar estado de carga
    try {
      // Iniciar autenticación OAuth con Google
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) {
        // Mostrar error de autenticación con Google
        toast.error(error.message);
        setLoading(false);
      }
      // En caso de éxito, Supabase redirigirá a Google para autenticación
    } catch (err) {
      // Error inesperado durante autenticación con Google
      toast.error('Error al iniciar con Google');
      setLoading(false);
    }
  };

  /**
   * Renderizado de la interfaz de usuario
   */
  return (
    <SafeAreaView style={styles.container}>
      {/* Configuración para evitar que el teclado cubra los campos */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Sección del logo y encabezado */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://api.a0.dev/assets/image?text=graduation%20cap%20icon%20purple%20modern&aspect=1:1' }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Sistema de Gestión</Text>
            <Text style={styles.subtitle}>Estudiantil</Text>
            <Text style={styles.description}>Inicia sesión para continuar</Text>
          </View>

          {/* Sección del formulario de autenticación */}
          <View style={styles.form}>
            {/* Campo de email */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#9C27B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Campo de contraseña */}
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9C27B0" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              {/* Botón para mostrar/ocultar contraseña */}
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

            {/* Botón de inicio de sesión */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>

            {/* Enlace para recuperar contraseña (próximamente) */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => toast('Funcionalidad próximamente')}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            {/* Botón de inicio de sesión con Google */}
            <TouchableOpacity
              style={[styles.googleButton, loading && styles.loginButtonDisabled]}
              onPress={handleGoogleSignIn}
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
          </View>

          {/* Sección de pie de página */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.signUpLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9C27B0',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
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
  loginButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
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
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#9C27B0',
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
  },
  signUpLink: {
    color: '#9C27B0',
    fontSize: 14,
    fontWeight: '600',
  },
});