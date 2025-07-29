import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { toast } from 'sonner-native';
import supabase from '../supabaseClient';
import { activityOperations } from '../utils/activity';

interface StudentForm {
  nombre: string;
  apellido: string;
  cedula: string;
  edad: string;
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

const initialForm: StudentForm = {
  nombre: '',
  apellido: '',
  cedula: '',
  edad: '',
  fecha_de_nacimiento: '',
  genero: '',
  herramienta_tecnica: '',
  pais_de_origen: '',
  colegio_de_origen: '',
  codigo_de_grupo: '',
  universidad: '',
  facultad: '',
  materia_favorita: '',
  horario: '',
  año_carrera: ''
};

type Nav = NativeStackNavigationProp<RootStackParamList, 'NewStudent'>;
type NewStudentRouteProp = RouteProp<RootStackParamList, 'NewStudent'>;

export default function NewStudentScreen() {
  const [form, setForm] = useState<StudentForm>(initialForm);
  const [editing, setEditing] = useState(false);
  const [originalCedula, setOriginalCedula] = useState<string | null>(null);
  const navigation = useNavigation<Nav>();
  const route = useRoute<NewStudentRouteProp>();

  useEffect(() => {
    if (route.params?.student) {
      const s = route.params.student as StudentForm & { edad: number };
      // Map number edad to string
      setForm({ ...s, edad: s.edad?.toString() ?? '' });
      setEditing(true);
      setOriginalCedula(s.cedula);
    }
  }, [route.params]);
  
  const onChange = (key: keyof StudentForm, value: string) => {
    setForm({...form, [key]: value});
  };
  
  const onSubmit = async () => {
    // Validación básica
    if (!form.nombre || !form.apellido || !form.cedula) {
      toast.error('Nombre, apellido y cédula son obligatorios');
      return;
    }
    
    try {
      const payload = {
        ...form,
        edad: form.edad ? parseInt(form.edad) : null,
      };
      if (editing) {
        const { data, error } = await supabase
          .from('Estudiantes')
          .update(payload)
          .eq('cedula', originalCedula || form.cedula)
          .select();
        if (error) throw error;
        toast.success('Estudiante actualizado');
        await activityOperations.log('actualizado', `Estudiante ${form.nombre} ${form.apellido} actualizado`);
      } else {
        const { data, error } = await supabase
          .from('Estudiantes')
          .insert([payload])
          .select();
        if (error) throw error;
        toast.success('Estudiante creado');
        await activityOperations.log('creado', `Estudiante ${form.nombre} ${form.apellido} creado`);
      }
      navigation.navigate('Home');
    } catch (e) {
      console.error(e);
      toast.error('Error de red. Verifica la conexión al servidor.');
    }
  };

  // Lista de todos los campos del formulario
  const formFields: Array<{key: keyof StudentForm, label: string, type?: 'numeric' | 'default'}> = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'apellido', label: 'Apellido' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'edad', label: 'Edad', type: 'numeric' },
    { key: 'fecha_de_nacimiento', label: 'Fecha de Nacimiento (YYYY-MM-DD)' },
    { key: 'genero', label: 'Género' },
    { key: 'herramienta_tecnica', label: 'Herramienta Técnica' },
    { key: 'pais_de_origen', label: 'País de Origen' },
    { key: 'colegio_de_origen', label: 'Colegio de Origen' },
    { key: 'codigo_de_grupo', label: 'Código de Grupo' },
    { key: 'universidad', label: 'Universidad' },
    { key: 'facultad', label: 'Facultad' },
    { key: 'materia_favorita', label: 'Materia Favorita' },
    { key: 'horario', label: 'Horario' },
    { key: 'año_carrera', label: 'Año de Carrera' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{flex: 1}} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')} 
            style={styles.back}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.title}>Nuevo Estudiante</Text>
          
          {formFields.map((field) => (
            <View key={field.key} style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>{field.label}</Text>
              <TextInput
                placeholder={field.label}
                placeholderTextColor="#666"
                value={form[field.key]}
                onChangeText={(value) => onChange(field.key, value)}
                style={styles.input}
                keyboardType={field.type === 'numeric' ? 'numeric' : 'default'}
              />
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.submit} 
            onPress={onSubmit}
          >
            <Text style={styles.submitText}>Guardar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  content: {
    padding: 20
  },
  back: {
    marginBottom: 12
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20
  },
  fieldContainer: {
    marginBottom: 12
  },
  fieldLabel: {
    color: '#9C27B0',
    marginBottom: 4,
    fontWeight: '500'
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff'
  },
  submit: {
    backgroundColor: '#9C27B0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});