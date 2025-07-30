/**
 * EduSync - Aplicación Principal
 * 
 * Este archivo contiene el componente raíz de la aplicación EduSync,
 * un sistema de gestión estudiantil desarrollado en React Native.
 * 
 * Funcionalidades principales:
 * - Configuración de navegación entre pantallas
 * - Verificación de conexión a Supabase
 * - Gestión de estados de carga y errores
 * - Tema personalizado de la aplicación
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importaciones de React Navigation para la navegación entre pantallas
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importaciones de React Native para componentes básicos
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, View, Text } from 'react-native';

// Importación de librería para notificaciones toast
import { Toaster } from 'sonner-native';

// Importación del cliente de Supabase para conexión a base de datos
import supabase from './supabaseClient';

// Importaciones de React para hooks de estado y efectos
import React, { useState, useEffect } from 'react';

// Importación de la pantalla de bienvenida
import WelcomeScreen from "./screens/WelcomeScreen";

// Importaciones de las pantallas principales de la aplicación
import HomeScreen from "./screens/HomeScreen"
import StudentDetailScreen from "./screens/StudentDetailScreen"
import PresentationScreen from "./screens/PresentationScreen"
import StudentsListScreen from "./screens/StudentsListScreen";
import NewStudentScreen from "./screens/NewStudentScreen";
import StatisticsScreen from "./screens/StatisticsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ChatbotScreen from "./screens/ChatbotScreen";

/**
 * Definición de tipos para la navegación de la aplicación
 * Cada ruta define los parámetros que puede recibir
 */
export type RootStackParamList = {
  // Pantalla de bienvenida - no requiere parámetros
  Welcome: undefined;
  
  // Pantallas principales de la aplicación
  Home: undefined;                                    // Pantalla principal
  StudentDetail: { student: any };                   // Detalles de estudiante
  Presentation: undefined;                           // Pantalla de presentación
  StudentsList: undefined;                           // Lista de estudiantes
  NewStudent: { student?: any } | undefined;         // Crear/editar estudiante
  Statistics: undefined;                             // Estadísticas
  Profile: undefined;                                // Perfil de usuario
  Settings: undefined;                               // Configuraciones
  Chatbot: undefined;                                // Chatbot asistente
};

/**
 * Tema personalizado con colores púrpura para la aplicación
 * Extiende el tema oscuro por defecto de React Navigation
 */
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#9C27B0',      // Color primario púrpura
    background: '#000000',   // Fondo negro
    card: '#4A148C',         // Color de tarjetas púrpura oscuro
    text: '#ffffff',         // Texto blanco
    border: '#333333',       // Bordes grises
    notification: '#9C27B0', // Color de notificaciones
  },
};

// Creación del navegador de pila con tipos TypeScript
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente principal de la aplicación EduSync
 * 
 * Responsabilidades:
 * - Verificar conexión a Supabase al iniciar
 * - Mostrar pantallas de carga y error según corresponda
 * - Configurar la navegación entre pantallas
 * - Aplicar el tema personalizado
 */
export default function App() {
  // Estados para manejar la conexión a la base de datos
  const [dbError, setDbError] = useState<string | null>(null);    // Error de conexión
  const [checkingDb, setCheckingDb] = useState(true);             // Estado de verificación

  /**
   * Efecto que se ejecuta al montar el componente
   * Verifica la conexión a Supabase realizando una consulta de prueba
   */
  useEffect(() => {
    // Realizar consulta de prueba para verificar API key y acceso a tablas
    supabase
      .from('Estudiantes')
      .select('cedula')
      .limit(1)
      .then(({ error }) => {
        if (error) {
          console.error('[Supabase] Connection test failed:', error);
          // Determinar el tipo de error y mostrar mensaje apropiado
          setDbError(error.message.includes('Invalid API key')
            ? 'Clave API inválida. Por favor actualiza SUPABASE_ANON_KEY en config.ts'
            : `Error de base de datos: ${error.message}`
          );
        }
      })
      .catch(err => {
        console.error('[Supabase] Unexpected connection error:', err);
        setDbError('Error inesperado al conectar con Supabase.');
      })
      .finally(() => setCheckingDb(false)); // Finalizar verificación
  }, []);

  /**
   * Renderizado condicional basado en el estado de conexión
   */
  return (
    <SafeAreaProvider style={styles.container}>
      {/* Componente para mostrar notificaciones toast */}
      <Toaster />
      
      {/* Mostrar pantalla de carga mientras se verifica la conexión */}
      {checkingDb ? (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Verificando conexión a la base de datos...</Text>
        </SafeAreaView>
      ) : dbError ? (
        // Mostrar pantalla de error si hay problemas de conexión
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>{dbError}</Text>
          <Text style={styles.errorText}>Esta aplicación requiere Supabase para funcionar.</Text>
        </SafeAreaView>
      ) : (
        // Mostrar la aplicación principal si la conexión es exitosa
        <NavigationContainer theme={CustomDarkTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Configuración de todas las rutas de navegación */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
            <Stack.Screen name="Presentation" component={PresentationScreen} />
            <Stack.Screen name="StudentsList" component={StudentsListScreen} />
            <Stack.Screen name="NewStudent" component={NewStudentScreen} />
            <Stack.Screen name="Statistics" component={StatisticsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

/**
 * Estilos de la aplicación
 * Define los estilos para contenedores, pantallas de carga y error
 */
const styles = StyleSheet.create({
  // Contenedor principal de la aplicación
  container: {
    flex: 1,
    userSelect: "none",
    backgroundColor: '#000000'
  },
  // Contenedor para pantalla de carga
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  // Texto de la pantalla de carga
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  // Contenedor para pantalla de error
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  // Texto de la pantalla de error
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
});