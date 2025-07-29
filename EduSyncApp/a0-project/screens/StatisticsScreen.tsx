import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import supabase from '../supabaseClient';

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

type Nav = NativeStackNavigationProp<RootStackParamList, 'Statistics'>;

export default function StatisticsScreen() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<Nav>();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setError(null);
      const { data, error: supaError } = await supabase
        .from<Student>('Estudiantes')
        .select('*');
      if (supaError) throw supaError;
      setStudents(data ?? []);
    } catch (err) {
      console.error('Error al obtener estudiantes', err);
      setError('No se pudieron cargar los datos.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.navigate('Home')} />
          <Text style={styles.title}>Estadísticas</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.navigate('Home')} />
          <Text style={styles.title}>Estadísticas</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calcular estadísticas
  const totalStudents = students.length;
  
  // Distribución por género
  const genderDistribution = students.reduce((acc, student) => {
    const gender = student.genero || 'No especificado';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por universidad
  const universityDistribution = students.reduce((acc, student) => {
    const university = student.universidad || 'No especificado';
    acc[university] = (acc[university] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por facultad
  const facultyDistribution = students.reduce((acc, student) => {
    const faculty = student.facultad || 'No especificado';
    acc[faculty] = (acc[faculty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por año de carrera
  const yearDistribution = students.reduce((acc, student) => {
    const year = student.año_carrera || 'No especificado';
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por horario
  const scheduleDistribution = students.reduce((acc, student) => {
    const schedule = student.horario || 'No especificado';
    acc[schedule] = (acc[schedule] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Distribución por herramienta preferida
  const toolDistribution = students.reduce((acc, student) => {
    const tool = student.herramienta_tecnica || 'No especificado';
    acc[tool] = (acc[tool] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Función para renderizar una distribución
  const renderDistribution = (title: string, data: Record<string, number>) => {
    const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
    
    return (
      <View style={styles.statCard}>
        <Text style={styles.statTitle}>{title}</Text>
        <View style={styles.distributionContainer}>
          {entries.map(([key, value], index) => {
            const percentage = (value / totalStudents) * 100;
            return (
              <View key={index} style={styles.distributionItem}>
                <View style={styles.distributionLabelContainer}>
                  <Text style={styles.distributionLabel}>{key}</Text>
                  <Text style={styles.distributionValue}>{value} ({percentage.toFixed(1)}%)</Text>
                </View>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        width: `${percentage}%`,
                        backgroundColor: getRandomColor(index)
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // Función para generar colores aleatorios pero consistentes
  const getRandomColor = (index: number) => {
    const colors = [
      '#9C27B0', '#3498db', '#2ecc71', '#e74c3c', '#f39c12', 
      '#1abc9c', '#d35400', '#8e44ad', '#27ae60', '#c0392b'
    ];
    return colors[index % colors.length];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.navigate('Home')} />
        <Text style={styles.title}>Estadísticas</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total de Estudiantes</Text>
          <Text style={styles.summaryValue}>{totalStudents}</Text>
        </View>
        
        {renderDistribution('Distribución por Género', genderDistribution)}
        {renderDistribution('Distribución por Universidad', universityDistribution)}
        {renderDistribution('Distribución por Facultad', facultyDistribution)}
        {renderDistribution('Distribución por Año de Carrera', yearDistribution)}
        {renderDistribution('Distribución por Horario', scheduleDistribution)}
        {renderDistribution('Herramientas Preferidas', toolDistribution)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A148C',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
  },
  summaryCard: {
    backgroundColor: '#4A148C',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statTitle: {
    color: '#9C27B0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  distributionContainer: {
    marginTop: 8,
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  distributionLabel: {
    color: '#fff',
    fontSize: 14,
  },
  distributionValue: {
    color: '#aaa',
    fontSize: 14,
  },
  barContainer: {
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});