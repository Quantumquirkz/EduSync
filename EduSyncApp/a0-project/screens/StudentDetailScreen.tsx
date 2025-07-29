import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';
import supabase from '../supabaseClient';
import { toast } from 'sonner-native';
import { activityOperations } from '../utils/activity';

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

type StudentDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'StudentDetail'>;
type StudentDetailScreenRouteProp = RouteProp<RootStackParamList, 'StudentDetail'>;

interface StudentDetailScreenProps {
  route: StudentDetailScreenRouteProp;
}

export default function StudentDetailScreen({ route }: StudentDetailScreenProps) {
  const { student } = route.params;
  const navigation = useNavigation<StudentDetailScreenNavigationProp>();

  const handleDelete = () => {
    Alert.alert('Eliminar', `¿Eliminar a ${student.nombre} ${student.apellido}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            const { error } = await supabase.from('Estudiantes').delete().eq('cedula', student.cedula);
            if (error) throw error;
            toast.success('Estudiante eliminado');
            await activityOperations.log('eliminado', `Estudiante ${student.nombre} ${student.apellido} eliminado`);
            navigation.navigate('Home');
          } catch (e) {
            console.error(e);
            toast.error('Error al eliminar');
          }
        } },
    ]);
  };

  const handleDownloadPdf = async () => {
    try {
      const html = `<!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 24px; }
            h1 { color: #4A148C; font-size: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            td, th { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
            th { background: #4A148C; color: #fff; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Expediente de ${student.nombre} ${student.apellido}</h1>
          <table>
            <tbody>
              <tr><th>Cédula</th><td>${student.cedula}</td></tr>
              <tr><th>Edad</th><td>${student.edad}</td></tr>
              <tr><th>Fecha de Nacimiento</th><td>${student.fecha_de_nacimiento}</td></tr>
              <tr><th>Género</th><td>${student.genero}</td></tr>
              <tr><th>País</th><td>${student.pais_de_origen}</td></tr>
              <tr><th>Universidad</th><td>${student.universidad}</td></tr>
              <tr><th>Facultad</th><td>${student.facultad}</td></tr>
              <tr><th>Código de Grupo</th><td>${student.codigo_de_grupo || '-'}</td></tr>
              <tr><th>Año de Carrera</th><td>${student.año_carrera}</td></tr>
              <tr><th>Horario</th><td>${student.horario}</td></tr>
              <tr><th>Materia Favorita</th><td>${student.materia_favorita || '-'}</td></tr>
              <tr><th>Colegio</th><td>${student.colegio_de_origen || '-'}</td></tr>
              <tr><th>Herramienta Preferida</th><td>${student.herramienta_tecnica}</td></tr>
            </tbody>
          </table>
        </body>
      </html>`;

      if (Platform.OS === 'web') {
        await Print.printAsync({ html });
      } else {
        const { uri } = await Print.printToFileAsync({ html });
        await Print.printAsync({ uri });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error al generar PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Estudiante</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('NewStudent', { student })} style={styles.actionIcon}>
            <Ionicons name="create-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.actionIcon}>
            <Ionicons name="trash" size={22} color="#ff6b6b" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownloadPdf} style={styles.actionIcon}>
            <Ionicons name="download-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitials}>
              {student.nombre.charAt(0)}{student.apellido.charAt(0)}
            </Text>
          </View>
          <Text style={styles.profileName}>{student.nombre} {student.apellido}</Text>
          <Text style={styles.profileSubtitle}>{student.universidad} - {student.facultad}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="person" size={20} color="#9C27B0" style={styles.sectionIcon} />
            Información Personal
          </Text>
          <View style={styles.infoCard}>
            <InfoRow label="Cédula" value={student.cedula} />
            <InfoRow label="Edad" value={student.edad.toString()} />
            <InfoRow label="Fecha de Nacimiento" value={student.fecha_de_nacimiento} />
            <InfoRow label="Género" value={student.genero} />
            <InfoRow label="País" value={student.pais_de_origen} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="school" size={20} color="#9C27B0" style={styles.sectionIcon} />
            Información Académica
          </Text>
          <View style={styles.infoCard}>
            <InfoRow label="Universidad" value={student.universidad} />
            <InfoRow label="Facultad" value={student.facultad} />
            <InfoRow label="Código de Grupo" value={student.codigo_de_grupo || '-'} />
            <InfoRow label="Año de Carrera" value={student.año_carrera} />
            <InfoRow label="Horario" value={student.horario} />
            <InfoRow label="Materia Favorita" value={student.materia_favorita} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="information-circle" size={20} color="#9C27B0" style={styles.sectionIcon} />
            Información Adicional
          </Text>
          <View style={styles.infoCard}>
            <InfoRow label="Colegio" value={student.colegio_de_origen || '-'} />
            <InfoRow label="Herramienta Preferida" value={student.herramienta_tecnica} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    backgroundColor: '#4A148C',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  actionIcon: {
    marginLeft: 12,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#aaa',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#9C27B0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 8,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  infoLabel: {
    width: '40%',
    fontWeight: '600',
    color: '#aaa',
  },
  infoValue: {
    flex: 1,
    color: '#fff',
  },
});