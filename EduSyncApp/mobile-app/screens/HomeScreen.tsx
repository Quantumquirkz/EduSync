/**
 * EduSync - Pantalla Principal (HomeScreen)
 * 
 * Esta pantalla es el dashboard principal de la aplicación EduSync.
 * Muestra un resumen general del sistema de gestión estudiantil con:
 * - Estadísticas de estudiantes y cursos
 * - Acciones rápidas para funciones principales
 * - Actividad reciente del sistema
 * - Navegación a otras pantallas
 * 
 * Funcionalidades:
 * - Carga y visualización de datos de estudiantes
 * - Actualización manual (pull-to-refresh)
 * - Navegación a otras pantallas
 * - Manejo de estados de carga y error
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importaciones de React y hooks necesarios
import React, { useEffect, useState, useCallback } from "react";

// Importaciones de componentes de React Native
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";

// Importaciones para navegación y área segura
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Importación de iconos
import { Ionicons } from "@expo/vector-icons";

// Importación para notificaciones toast
import { toast } from "sonner-native";

// Importaciones de tipos y utilidades locales
import { RootStackParamList } from "../App";
import supabase from '../supabaseClient';
import { activityOperations, Activity } from '../utils/activity';

/**
 * Interfaz que define la estructura de un estudiante
 * 
 * Esta interfaz se utiliza para tipar los datos de estudiantes
 * que se obtienen de la base de datos Supabase.
 */
interface Student {
  nombre: string;                 // Nombre del estudiante
  apellido: string;               // Apellido del estudiante
  cedula: string;                 // Número de cédula (identificador único)
  edad: number;                   // Edad del estudiante
  fecha_de_nacimiento: string;    // Fecha de nacimiento
  genero: string;                 // Género del estudiante
  herramienta_tecnica: string;    // Herramienta técnica preferida
  pais_de_origen: string;         // País de origen
  colegio_de_origen: string;      // Colegio de procedencia
  codigo_de_grupo: string;        // Código del grupo académico
  universidad: string;            // Universidad donde estudia
  facultad: string;               // Facultad de la universidad
  materia_favorita: string;       // Materia favorita
  horario: string;                // Horario de clases
  año_carrera: string;            // Año de la carrera
}

// Tipo para la navegación de esta pantalla
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/**
 * Componente principal de la pantalla de inicio
 * 
 * Este componente renderiza el dashboard principal con estadísticas,
 * acciones rápidas y actividad reciente del sistema.
 */
export default function HomeScreen() {
  // Hook de navegación para moverse entre pantallas
  const navigation = useNavigation<HomeScreenNavigationProp>();
  
  // Estados para manejar los datos y la interfaz
  const [students, setStudents] = useState<Student[]>([]);        // Lista de estudiantes
  const [loading, setLoading] = useState(true);                   // Estado de carga inicial
  const [refreshing, setRefreshing] = useState(false);            // Estado de actualización manual
  const [error, setError] = useState<string | null>(null);        // Mensaje de error
  const [activities, setActivities] = useState<Activity[]>([]);   // Actividades recientes

  /**
   * Función para obtener estudiantes desde Supabase
   * 
   * Esta función se ejecuta al cargar la pantalla y cuando
   * el usuario hace pull-to-refresh para actualizar los datos.
   */
  const fetchStudents = useCallback(async () => {
    try {
      setError(null); // Limpiar errores previos
      
      // Consultar todos los estudiantes desde Supabase
      const { data, error: supaError } = await supabase
        .from<Student>('Estudiantes')
        .select('*');
      
      // Manejar errores de Supabase
      if (supaError) throw supaError;
      
      // Actualizar estado con los datos obtenidos
      setStudents(data ?? []);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
      setError("No se pudieron cargar los datos.");
      toast.error("Error al cargar datos");
      // En caso de error, mostrar lista vacía
      setStudents([]);
    } finally {
      // Finalizar estados de carga
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Efecto que se ejecuta al montar el componente
   * Carga los estudiantes y las actividades recientes
   */
  useEffect(() => {
    fetchStudents(); // Cargar estudiantes
    activityOperations.fetchRecent().then(setActivities); // Cargar actividades recientes
  }, [fetchStudents]);

  /**
   * Función para manejar la actualización manual (pull-to-refresh)
   * 
   * Se ejecuta cuando el usuario desliza hacia abajo para actualizar
   */
  const onRefresh = useCallback(() => {
    setRefreshing(true); // Activar estado de actualización
    fetchStudents(); // Recargar datos
  }, [fetchStudents]);

  /**
   * Renderiza el encabezado de la pantalla
   * 
   * Incluye el título del sistema y botones de navegación
   * para perfil y presentación.
   */
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Sistema de Gestión Estudiantil</Text>
        <View style={styles.headerButtons}>
          {/* Botón para navegar al perfil */}
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
          {/* Botón para navegar a la presentación */}
          <TouchableOpacity 
            style={styles.presentationButton}
            onPress={() => navigation.navigate('Presentation')}
          >
            <Text style={styles.presentationButtonText}>Presentación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Cálculo de estadísticas para las tarjetas de resumen
  const totalStudents = students.length; // Total de estudiantes
  const totalCourses = [...new Set(students.map(s => s.facultad))].length; // Total de facultades únicas
  const attendance = '95%'; // Porcentaje de asistencia (placeholder)

  /**
   * Renderiza las tarjetas de resumen con estadísticas
   * 
   * Muestra información clave del sistema:
   * - Número total de estudiantes
   * - Número de cursos/facultades
   * - Acceso al asistente AI
   */
  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      {/* Tarjeta de estudiantes */}
      <View style={styles.summaryCard}>
        <Ionicons name="people" size={24} color="#fff" />
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryValue}>{loading ? '...' : totalStudents}</Text>
          <Text style={styles.summaryLabel}>Estudiantes</Text>
        </View>
      </View>
      
      {/* Tarjeta de cursos */}
      <View style={styles.summaryCard}>
        <Ionicons name="book" size={24} color="#fff" />
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryValue}>{loading ? '...' : totalCourses}</Text>
          <Text style={styles.summaryLabel}>Cursos</Text>
        </View>
      </View>
      
      {/* Tarjeta del asistente AI */}
      <View style={styles.summaryCard}>
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <View style={styles.summaryTextContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Chatbot')}>
            <Text style={styles.summaryValue}>Gladys</Text>
            <Text style={styles.summaryLabel}>Asistente AI</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /**
   * Renderiza las acciones rápidas disponibles
   * 
   * Proporciona acceso directo a funciones principales
   * como importar datos, exportar reportes, etc.
   */
  const renderQuickActions = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActionsGrid}>
        {/* Botón de importar datos */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => {
            toast('Funcionalidad de importación en desarrollo');
          }}
        >
          <Ionicons name="cloud-download" size={28} color="#fff" />
          <Text style={styles.actionButtonText}>Importar Datos</Text>
        </TouchableOpacity>
        
        {/* Botón de exportar reportes */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('StudentsList')}
        >
          <Ionicons name="list" size={28} color="#fff" />
          <Text style={styles.actionButtonText}>Lista de Estudiantes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('NewStudent')}
        >
          <Ionicons name="person-add" size={28} color="#fff" />
          <Text style={styles.actionButtonText}>Nuevo Estudiante</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#9C27B0' }]}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Ionicons name="stats-chart" size={28} color="#fff" />
          <Text style={styles.actionButtonText}>Estadísticas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Actividad Reciente</Text>
      <View style={styles.activityContainer}>
        {activities.length === 0 && (
          <Text style={{ color: '#aaa', textAlign: 'center' }}>No hay actividad reciente.</Text>
        )}
        {activities.map((act) => (
          <View key={act.id} style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: act.tipo === 'creado' ? '#4CAF50' : act.tipo === 'actualizado' ? '#2196F3' : '#e74c3c' }]} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{act.descripcion}</Text>
              <Text style={styles.activityTime}>{new Date(act.created_at || '').toLocaleString()}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#9C27B0" />
        <Text style={styles.loadingText}>Cargando datos...</Text>
      </SafeAreaView>
    );
  }

  // Render UI even if there is an error, show an inline banner
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{error}</Text>
        </View>
      )}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderSummaryCards()}
        {renderQuickActions()}
        {renderRecentActivity()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  errorBanner: {
    backgroundColor: '#e74c3c',
    padding: 8,
    margin: 16,
    borderRadius: 6,
  },
  errorBannerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#9C27B0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#4A148C",
    padding: 20,
    paddingBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginRight: 12,
  },
  presentationButton: {
    backgroundColor: '#7B1FA2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  presentationButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  summaryCard: {
    backgroundColor: "#4A148C",
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  summaryTextContainer: {
    marginLeft: 8,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#ddd',
    fontSize: 11,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 8,
    fontWeight: '500',
  },
  activityContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#fff',
    fontSize: 14,
  },
  activityTime: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
});