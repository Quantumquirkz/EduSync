import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { toast } from "sonner-native";
import { RootStackParamList } from "../App";
import supabase from '../supabaseClient';
import { activityOperations, Activity } from '../utils/activity';

interface Student {
  nombre: string;
  apellido: string;
  cedula: string;
  edad: number;
  fecha_de_nacimiento: string;
  genero: string;
  herramienta_tecnica: string;
  pais_de_origen: string;
  colegio_de_origen: string;
  codigo_de_grupo: string;
  universidad: string;
  facultad: string;
  materia_favorita: string;
  horario: string;
  año_carrera: string;
}

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);

  const fetchStudents = useCallback(async () => {
    try {
      setError(null);
      // Fetch from Supabase
      const { data, error: supaError } = await supabase
        .from<Student>('Estudiantes')
        .select('*');
      if (supaError) throw supaError;
      setStudents(data ?? []);
    } catch (error) {
      console.error("Error al obtener estudiantes", error);
      setError("No se pudieron cargar los datos.");
      toast.error("Error al cargar datos");
      // No fallback: mostrar lista vacía
      setStudents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    activityOperations.fetchRecent().then(setActivities);
  }, [fetchStudents]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, [fetchStudents]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Sistema de Gestión Estudiantil</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
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

  const totalStudents = students.length;
  const totalCourses = [...new Set(students.map(s => s.facultad))].length;
  const attendance = '95%'; // reemplazar con dato real cuando esté disponible

  const renderSummaryCards = () => (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryCard}>
        <Ionicons name="people" size={24} color="#fff" />
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryValue}>{loading ? '...' : totalStudents}</Text>
          <Text style={styles.summaryLabel}>Estudiantes</Text>
        </View>
      </View>
      
      <View style={styles.summaryCard}>
        <Ionicons name="book" size={24} color="#fff" />
        <View style={styles.summaryTextContainer}>
          <Text style={styles.summaryValue}>{loading ? '...' : totalCourses}</Text>
          <Text style={styles.summaryLabel}>Cursos</Text>
        </View>
      </View>
      
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

  const renderQuickActions = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => {
            toast('Funcionalidad de importación en desarrollo');
          }}
        >
          <Ionicons name="cloud-download" size={28} color="#fff" />
          <Text style={styles.actionButtonText}>Importar Datos</Text>
        </TouchableOpacity>
        
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