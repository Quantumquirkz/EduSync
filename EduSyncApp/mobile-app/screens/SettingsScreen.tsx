import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toast } from 'sonner-native';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsState {
  notifications: boolean;
  darkMode: boolean;
  autoSync: boolean;
  biometrics: boolean;
  analytics: boolean;
}

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [settings, setSettings] = useState<SettingsState>({
    notifications: true,
    darkMode: true,
    autoSync: true,
    biometrics: false,
    analytics: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('app_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Error al guardar configuración');
    }
  };

  const toggleSetting = (key: keyof SettingsState) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
    
    // Show feedback for specific settings
    if (key === 'notifications') {
      toast.success(newSettings.notifications ? 'Notificaciones activadas' : 'Notificaciones desactivadas');
    }
  };

  const clearCache = () => {
    Alert.alert(
      'Limpiar Caché',
      '¿Estás seguro de que quieres limpiar el caché de la aplicación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpiar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear specific cache keys, not all AsyncStorage
              await AsyncStorage.removeItem('students_cache');
              await AsyncStorage.removeItem('statistics_cache');
              toast.success('Caché limpiado exitosamente');
            } catch (error) {
              toast.error('Error al limpiar caché');
            }
          },
        },
      ]
    );
  };

  const resetSettings = () => {
    Alert.alert(
      'Restablecer Configuración',
      '¿Estás seguro de que quieres restablecer toda la configuración a los valores predeterminados?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: () => {
            const defaultSettings: SettingsState = {
              notifications: true,
              darkMode: true,
              autoSync: true,
              biometrics: false,
              analytics: true,
            };
            saveSettings(defaultSettings);
            toast.success('Configuración restablecida');
          },
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    value, 
    onToggle, 
    color = '#9C27B0' 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
    color?: string;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#333', true: '#9C27B0' }}
        thumbColor={value ? '#fff' : '#666'}
      />
    </View>
  );

  const ActionItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    color = '#9C27B0',
    destructive = false 
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    color?: string;
    destructive?: boolean;
  }) => (
    <TouchableOpacity 
      style={[styles.actionItem, destructive && styles.destructiveItem]} 
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={destructive ? '#f44336' : color} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, destructive && styles.destructiveText]}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configuración</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <SettingItem
            icon="notifications-outline"
            title="Notificaciones"
            subtitle="Recibir notificaciones push"
            value={settings.notifications}
            onToggle={() => toggleSetting('notifications')}
          />

          <SettingItem
            icon="moon-outline"
            title="Modo Oscuro"
            subtitle="Usar tema oscuro"
            value={settings.darkMode}
            onToggle={() => toggleSetting('darkMode')}
          />

          <SettingItem
            icon="sync-outline"
            title="Sincronización Automática"
            subtitle="Sincronizar datos automáticamente"
            value={settings.autoSync}
            onToggle={() => toggleSetting('autoSync')}
            color="#4CAF50"
          />
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          
          <SettingItem
            icon="finger-print-outline"
            title="Autenticación Biométrica"
            subtitle="Usar huella dactilar o Face ID"
            value={settings.biometrics}
            onToggle={() => toggleSetting('biometrics')}
            color="#2196F3"
          />

          <ActionItem
            icon="key-outline"
            title="Cambiar Contraseña"
            subtitle="Actualizar tu contraseña"
            onPress={() => toast('Funcionalidad próximamente')}
            color="#FF9800"
          />
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacidad</Text>
          
          <SettingItem
            icon="analytics-outline"
            title="Análisis de Uso"
            subtitle="Ayudar a mejorar la app"
            value={settings.analytics}
            onToggle={() => toggleSetting('analytics')}
            color="#4CAF50"
          />

          <ActionItem
            icon="document-text-outline"
            title="Política de Privacidad"
            subtitle="Ver nuestra política de privacidad"
            onPress={() => toast('Funcionalidad próximamente')}
          />

          <ActionItem
            icon="shield-checkmark-outline"
            title="Términos de Servicio"
            subtitle="Ver términos y condiciones"
            onPress={() => toast('Funcionalidad próximamente')}
          />
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gestión de Datos</Text>
          
          <ActionItem
            icon="cloud-download-outline"
            title="Exportar Datos"
            subtitle="Descargar tus datos"
            onPress={() => toast('Funcionalidad próximamente')}
            color="#2196F3"
          />

          <ActionItem
            icon="trash-outline"
            title="Limpiar Caché"
            subtitle="Liberar espacio de almacenamiento"
            onPress={clearCache}
            color="#FF9800"
          />

          <ActionItem
            icon="refresh-outline"
            title="Restablecer Configuración"
            subtitle="Volver a valores predeterminados"
            onPress={resetSettings}
            destructive
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca de</Text>
          
          <ActionItem
            icon="information-circle-outline"
            title="Información de la App"
            subtitle="Versión 1.0.0"
            onPress={() => toast('Sistema de Gestión Estudiantil v1.0.0')}
          />

          <ActionItem
            icon="help-circle-outline"
            title="Ayuda y Soporte"
            subtitle="Obtener ayuda"
            onPress={() => toast('Funcionalidad próximamente')}
          />

          <ActionItem
            icon="star-outline"
            title="Calificar App"
            subtitle="Déjanos tu opinión"
            onPress={() => toast('Funcionalidad próximamente')}
            color="#FFD700"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#4A148C',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  destructiveItem: {
    borderWidth: 1,
    borderColor: '#f44336',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  destructiveText: {
    color: '#f44336',
  },
});