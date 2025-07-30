/**
 * EduSync - Aplicación Principal
 * Sistema de gestión estudiantil en React Native
 * @author EduSync Team
 * @version 1.0.0
 */

// Navegación
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// React Native
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, View, Text } from 'react-native';

// Utilidades
import { Toaster } from 'sonner-native';
import supabase from './supabaseClient';
import React, { useState, useEffect } from 'react';

// Pantallas
import WelcomeScreen from "./screens/WelcomeScreen";
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
 * Tipos de navegación
 */
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  StudentDetail: { student: any };
  Presentation: undefined;
  StudentsList: undefined;
  NewStudent: { student?: any } | undefined;
  Statistics: undefined;
  Profile: undefined;
  Settings: undefined;
  Chatbot: undefined;
};

/**
 * Tema personalizado púrpura
 */
const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#9C27B0',      // Púrpura principal
    background: '#000000',   // Fondo negro
    card: '#4A148C',         // Tarjetas púrpura oscuro
    text: '#ffffff',         // Texto blanco
    border: '#333333',       // Bordes grises
    notification: '#9C27B0', // Notificaciones
  },
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente principal de EduSync
 */
export default function App() {
  const [dbError, setDbError] = useState<string | null>(null);
  const [checkingDb, setCheckingDb] = useState(true);

  // Verificar conexión a Supabase al iniciar
  useEffect(() => {
    supabase
      .from('Estudiantes')
      .select('cedula')
      .limit(1)
      .then(({ error }) => {
        if (error) {
          console.error('[Supabase] Connection test failed:', error);
          setDbError(error.message.includes('Invalid API key')
            ? 'Clave API inválida. Actualiza SUPABASE_ANON_KEY en config.ts'
            : `Error de base de datos: ${error.message}`
          );
        }
      })
      .catch(err => {
        console.error('[Supabase] Unexpected connection error:', err);
        setDbError('Error inesperado al conectar con Supabase.');
      })
      .finally(() => setCheckingDb(false));
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster />
      
      {checkingDb ? (
        // Pantalla de carga
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Verificando conexión a la base de datos...</Text>
        </SafeAreaView>
      ) : dbError ? (
        // Pantalla de error
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>{dbError}</Text>
          <Text style={styles.errorText}>Esta aplicación requiere Supabase para funcionar.</Text>
        </SafeAreaView>
      ) : (
        // Aplicación principal
        <NavigationContainer theme={CustomDarkTheme}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none",
    backgroundColor: '#000000'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
});