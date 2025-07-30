/**
 * EduSync - Punto de Entrada de la Aplicación
 * 
 * Este archivo es el punto de entrada principal de la aplicación EduSync.
 * Se encarga de registrar el componente raíz de la aplicación con Expo,
 * permitiendo que la aplicación se ejecute tanto en Expo Go como en builds nativos.
 * 
 * Funcionalidades:
 * - Registro del componente raíz de la aplicación
 * - Configuración del entorno de Expo
 * - Punto de entrada unificado para desarrollo y producción
 * 
 * @author EduSync Team
 * @version 1.0.0
 */

// Importación de la función de registro de Expo
import { registerRootComponent } from 'expo';

// Importación del componente principal de la aplicación
import App from './App';

/**
 * Registro del componente raíz de la aplicación
 * 
 * registerRootComponent es una función de Expo que:
 * - Llama internamente a AppRegistry.registerComponent('main', () => App)
 * - Asegura que el entorno esté configurado correctamente
 * - Funciona tanto en Expo Go como en builds nativos
 * - Configura automáticamente el entorno de desarrollo o producción
 * 
 * Esta es la forma recomendada de registrar el componente principal
 * en aplicaciones Expo/React Native.
 */
registerRootComponent(App);
