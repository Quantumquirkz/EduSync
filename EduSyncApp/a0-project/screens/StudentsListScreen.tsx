import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
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

type Nav = NativeStackNavigationProp<RootStackParamList, 'StudentsList'>;

export default function StudentsListScreen() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<Nav>();
  const mockData: Student[] = [];

  useEffect(() => {
    (async () => {
      try {
        const { data: students, error } = await supabase
          .from<Student>('Estudiantes')
          .select('*');
        if (error) throw error;
        setData(students ?? []);
      } catch (e) {
        console.error('Error fetching students', e);
        // fallback to empty or mock
        setData(mockData);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}><ActivityIndicator size="large" color="#9C27B0"/></SafeAreaView>
    );
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="arrow-back" size={24} color="#fff" onPress={() => navigation.navigate('Home')} />
        <Text style={styles.title}>Lista de Estudiantes</Text>
      </View>
      
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