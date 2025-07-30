/**
 * EduSync - Pantalla de Crear/Editar Estudiante (NewStudentScreen)
 * 
 * Esta pantalla permite crear nuevos estudiantes o editar estudiantes existentes
 * en el sistema EduSync. Proporciona un formulario completo con validación
 * y manejo de errores.
 * 
 * Funcionalidades:
 * - Formulario completo para datos de estudiantes
 * - Validación de campos obligatorios
 * - Modo de creación y edición
 * - Integración con Supabase para persistencia
 * - Registro de actividades del sistema
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importaciones de React y hooks necesarios
import React, { useState, useEffect } from 'react';

// Importaciones de componentes de React Native
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

// Importaciones para navegación y área segura
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, RouteProp } from '@react-navigation/native-stack';

// Importación de iconos
import { Ionicons } from '@expo/vector-icons';

// Importaciones de tipos y utilidades locales
import { RootStackParamList } from '../App';
import { toast } from 'sonner-native';
import supabase from '../supabaseClient';
import { activityOperations } from '../utils/activity';

/**
 * Interfaz que define la estructura del formulario de estudiante
 * 
 * Esta interfaz se utiliza para manejar los datos del formulario.
 * Todos los campos son strings para facilitar el manejo en los inputs,
 * excepto la edad que se convierte a número al enviar.
 */
interface StudentForm {
  nombre: string;                 // Nombre del estudiante
  apellido: string;               // Apellido del estudiante
  cedula: string;                 // Número de cédula (identificador único)
  edad: string;                   // Edad como string (se convierte a número)
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

/**
 * Valores iniciales del formulario
 * 
 * Se utiliza tanto para inicializar el formulario como para
 * limpiarlo después de una operación exitosa.
 */
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

// Tipos para la navegación y parámetros de ruta
type Nav = NativeStackNavigationProp<RootStackParamList, 'NewStudent'>;
type NewStudentRouteProp = RouteProp<RootStackParamList, 'NewStudent'>;

/**
 * Componente principal de la pantalla de crear/editar estudiante
 * 
 * Este componente maneja tanto la creación de nuevos estudiantes
 * como la edición de estudiantes existentes, dependiendo de los
 * parámetros recibidos en la navegación.
 */
export default function NewStudentScreen() {
  // Estados para manejar el formulario y la interfaz
  const [form, setForm] = useState<StudentForm>(initialForm);        // Datos del formulario
  const [editing, setEditing] = useState(false);                     // Modo de edición
  const [originalCedula, setOriginalCedula] = useState<string | null>(null); // Cédula original para edición
  
  // Hooks de navegación
  const navigation = useNavigation<Nav>();
  const route = useRoute<NewStudentRouteProp>();

  /**
   * Efecto que se ejecuta al montar el componente
   * 
   * Si se recibe un estudiante como parámetro, se carga en el formulario
   * y se activa el modo de edición.
   */
  useEffect(() => {
    if (route.params?.student) {
      const s = route.params.student as StudentForm & { edad: number };
      // Convertir edad de número a string para el formulario
      setForm({ ...s, edad: s.edad?.toString() ?? '' });
      setEditing(true); // Activar modo de edición
      setOriginalCedula(s.cedula); // Guardar cédula original
    }
  }, [route.params]);
  
  /**
   * Función para actualizar campos del formulario
   * 
   * @param key - Clave del campo a actualizar
   * @param value - Nuevo valor del campo
   */
  const onChange = (key: keyof StudentForm, value: string) => {
    setForm({...form, [key]: value});
  };
  
  /**
   * Función para enviar el formulario
   * 
   * Maneja tanto la creación como la actualización de estudiantes,
   * incluyendo validación y registro de actividades.
   */
  const onSubmit = async () => {
    // Validación básica de campos obligatorios
    if (!form.nombre || !form.apellido || !form.cedula) {
      toast.error('Nombre, apellido y cédula son obligatorios');
      return;
    }
    
    try {
      // Preparar payload convirtiendo edad a número
      const payload = {
        ...form,
        edad: form.edad ? parseInt(form.edad) : null,
      };
      
      if (editing) {
        // Modo de edición: actualizar estudiante existente
        const { data, error } = await supabase
          .from('Estudiantes')
          .update(payload)
          .eq('cedula', originalCedula || form.cedula)
          .select();
        if (error) throw error;
        toast.success('Estudiante actualizado');
        await activityOperations.log('actualizado', `Estudiante ${form.nombre} ${form.apellido} actualizado`);
      } else {
        // Modo de creación: insertar nuevo estudiante
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