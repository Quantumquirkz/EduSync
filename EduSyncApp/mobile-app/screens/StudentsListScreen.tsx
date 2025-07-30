/**
 * EduSync - Pantalla de Lista de Estudiantes (StudentsListScreen)
 * 
 * Esta pantalla muestra una lista completa de todos los estudiantes
 * registrados en el sistema EduSync en formato de tabla. Permite
 * navegar a los detalles de cada estudiante y proporciona una vista
 * general de todos los datos de estudiantes.
 * 
 * Funcionalidades:
 * - Visualización de todos los estudiantes en formato tabla
 * - Navegación a detalles de estudiante individual
 * - Carga de datos desde Supabase
 * - Manejo de estados de carga y error
 * - Tabla con scroll horizontal para todos los campos
 * 
 * Características de la interfaz:
 * - Tabla responsive con scroll horizontal
 * - Encabezados de columnas fijos
 * - Filas clickeables para ver detalles
 * - Indicador de carga durante la obtención de datos
 * - Navegación de regreso a la pantalla principal
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importaciones de React y hooks necesarios
import React, { useEffect, useState } from 'react';

// Importaciones de componentes de React Native
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';

// Importaciones para navegación y área segura
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Importación de iconos
import { Ionicons } from '@expo/vector-icons';

// Importaciones de tipos y utilidades locales
import { RootStackParamList } from '../App';
import supabase from '../supabaseClient';

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
type Nav = NativeStackNavigationProp<RootStackParamList, 'StudentsList'>;

/**
 * Componente principal de la pantalla de lista de estudiantes
 * 
 * Este componente carga y muestra todos los estudiantes del sistema
 * en formato de tabla, permitiendo navegar a los detalles de cada uno.
 */
export default function StudentsListScreen() {
  // Estados para manejar los datos y la interfaz
  const [data, setData] = useState<Student[]>([]);    // Lista de estudiantes
  const [loading, setLoading] = useState(true);       // Estado de carga inicial
  const navigation = useNavigation<Nav>();            // Hook de navegación
  
  // Datos mock para fallback en caso de error
  const mockData: Student[] = [];

  /**
   * Efecto que se ejecuta al montar el componente
   * 
   * Carga todos los estudiantes desde la base de datos Supabase
   * y maneja posibles errores de conexión.
   */
  useEffect(() => {
    (async () => {
      try {
        // Consultar todos los estudiantes desde Supabase
        const { data: students, error } = await supabase
          .from<Student>('Estudiantes')
          .select('*');
        
        if (error) throw error; // Lanzar error si hay problema con Supabase
        
        // Actualizar estado con los datos obtenidos
        setData(students ?? []);
      } catch (e) {
        // Manejo de errores - usar datos mock como fallback
        console.error('Error fetching students', e);
        setData(mockData);
      } finally {
        // Finalizar estado de carga
        setLoading(false);
      }
    })();
  }, []);

  /**
   * Renderizado de pantalla de carga
   * 
   * Se muestra mientras se obtienen los datos de la base de datos.
   */
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#9C27B0"/>
      </SafeAreaView>
    );
  }

  /**
   * Renderiza una fila individual de la tabla de estudiantes
   * 
   * Cada fila representa un estudiante con todos sus datos
   * y es clickeable para navegar a los detalles.
   * 
   * @param item - Objeto Student con los datos del estudiante
   * @return Componente TouchableOpacity con los datos del estudiante
   */
  const renderItem = ({ item }: { item: Student }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <TouchableOpacity onPress={() => navigation.navigate('StudentDetail', { student: item })}>
        <View style={styles.row}>
          <Text style={[styles.cell, { width: 120 }]}>{item.nombre}</Text>
          <Text style={[styles.cell, { width: 120 }]}>{item.apellido}</Text>
          <Text style={[styles.cell, { width: 120 }]}>{item.cedula}</Text>
          <Text style={[styles.cell, { width: 60 }]}>{item.edad}</Text>
          <Text style={[styles.cell, { width: 120 }]}>{item.fecha_de_nacimiento}</Text>
          <Text style={[styles.cell, { width: 100 }]}>{item.genero}</Text>
          <Text style={[styles.cell, { width: 150 }]}>{item.herramienta_tecnica}</Text>
          <Text style={[styles.cell, { width: 100 }]}>{item.pais_de_origen}</Text>
          <Text style={[styles.cell, { width: 150 }]}>{item.colegio_de_origen}</Text>
          <Text style={[styles.cell, { width: 120 }]}>{item.codigo_de_grupo}</Text>
          <Text style={[styles.cell, { width: 150 }]}>{item.universidad}</Text>
          <Text style={[styles.cell, { width: 150 }]}>{item.facultad}</Text>
          <Text style={[styles.cell, { width: 150 }]}>{item.materia_favorita}</Text>
          <Text style={[styles.cell, { width: 100 }]}>{item.horario}</Text>
          <Text style={[styles.cell, { width: 120 }]}>{item.año_carrera}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  /**
   * Renderizado principal de la pantalla
   */
  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado con botón de regreso y título */}
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.navigate('Home')} />
        <Text style={styles.title}>Lista de Estudiantes</Text>
      </View>
      
      {/* Encabezados de la tabla */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { width: 120 }]}>Nombre</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Apellido</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Cédula</Text>
        <Text style={[styles.headerCell, { width: 60 }]}>Edad</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>F. Nacimiento</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Género</Text>
        <Text style={[styles.headerCell, { width: 150 }]}>Herramienta</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>País</Text>
        <Text style={[styles.headerCell, { width: 150 }]}>Colegio</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Código Grupo</Text>
        <Text style={[styles.headerCell, { width: 150 }]}>Universidad</Text>
        <Text style={[styles.headerCell, { width: 150 }]}>Facultad</Text>
        <Text style={[styles.headerCell, { width: 150 }]}>Materia Favorita</Text>
        <Text style={[styles.headerCell, { width: 100 }]}>Horario</Text>
        <Text style={[styles.headerCell, { width: 120 }]}>Año Carrera</Text>
      </View>
      
      <FlatList 
        data={data} 
        keyExtractor={(i) => i.cedula}
        renderItem={renderItem}
        style={styles.flatList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#4A148C' },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 12 },
  tableHeader: { flexDirection: 'row', padding: 12, backgroundColor: '#1a1a1a' },
  headerCell: { color: '#9C27B0', fontWeight: 'bold', paddingHorizontal: 8 },
  row: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  cell: { color: '#fff', paddingHorizontal: 8 },
  flatList: { maxHeight: '85%' }
});