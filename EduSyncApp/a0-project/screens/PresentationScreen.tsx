import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../App';

type PresentationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Presentation'>;

export default function PresentationScreen() {
  const navigation = useNavigation<PresentationScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Presentación del Grupo 1IL-128</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.universityHeader}>
          <Text style={styles.universityText}>UNIVERSIDAD TECNOLÓGICA DE PANAMÁ</Text>
          <Text style={styles.universityText}>FACULTAD DE INGENIERÍA DE SISTEMAS COMPUTACIONALES</Text>
          <Text style={styles.universityText}>DEPARTAMENTO DE PROGRAMACIÓN DE COMPUTADORAS</Text>
          <Text style={styles.projectTitle}>PROYECTO SEMESTRAL</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Facilitador(a): </Text>
            <Text style={styles.infoValue}>Emilio Batista</Text>
          </Text>
          
          <Text style={styles.infoRow}>
            <Text style={styles.infoLabel}>Asignatura: </Text>
            <Text style={styles.infoValue}>Herramientas de la Programación Aplicada II</Text>
          </Text>
        </View>

        <View style={styles.studentsSection}>
          <Text style={styles.sectionTitle}>Estudiantes:</Text>
          <Text style={styles.studentItem}>• Terry He | 8-1021-2180</Text>
          <Text style={styles.studentItem}>• Jhuomar Barría | 9-766-196</Text>
          <Text style={styles.studentItem}>• Geremi Tejeira | 9-768-42</Text>
        </View>

        <View style={styles.groupSection}>
          <Text style={styles.groupText}>Grupo: 1IL-128</Text>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descripción del Proyecto</Text>
          <Text style={styles.descriptionText}>
            Este proyecto consiste en una aplicación móvil desarrollada con React Native (Expo Go) 
            y un backend en Java (Spring Boot) que se conecta a una base de datos SQL Server. 
            El objetivo es gestionar y consultar información de estudiantes del grupo 1IL-128.
          </Text>

          <Text style={styles.sectionTitle}>Tecnologías Utilizadas</Text>
          <Text style={styles.techItem}>• Frontend: React Native (Expo Go), TypeScript</Text>
          <Text style={styles.techItem}>• Backend: Java, Spring Boot</Text>
          <Text style={styles.techItem}>• Base de Datos: SQL Server</Text>
        </View>
        <Image
          source={{ uri: 'https://storage.googleapis.com/a0-prod-us-central1-media/chat_output/af749df6-b8b7-4a0b-8d19-ee6623e1e694-image.jpg' }}
          style={styles.presentationImage}
          resizeMode="contain"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    backgroundColor: '#1e1e1e',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
    padding: 20,
  },
  universityHeader: {
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 12,
  },
  universityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  projectTitle: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 8,
    color: '#fff',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#3498db',
  },
  infoValue: {
    color: '#fff',
  },
  studentsSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#3498db',
  },
  studentItem: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 15,
  },
  groupSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  groupText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionSection: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  descriptionText: {
    color: '#ddd',
    lineHeight: 22,
    marginBottom: 16,
  },
  techItem: {
    color: '#ddd',
    marginBottom: 6,
  },
  presentationImage: {
    width: '100%',
    height: 200, // Adjust height as needed
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 40, // Add some bottom margin
  },
});