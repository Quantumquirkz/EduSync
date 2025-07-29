import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const moveAnim = React.useRef(new Animated.Value(50)).current;
  const buttonAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(moveAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        delay: 300,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo y Título Animados */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: moveAnim }],
            },
          ]}
        >
          <Image
            source={{
              uri: 'https://api.a0.dev/assets/image?text=graduation%20cap%20with%20students%20modern%20purple&aspect=1:1',
            }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sistema de Gestión</Text>
          <Text style={styles.subtitle}>Estudiantil</Text>
          <Text style={styles.description}>
            Administra fácilmente la información de tus estudiantes
          </Text>
        </Animated.View>

        {/* Características */}
        <Animated.View
          style={[
            styles.features,
            {
              opacity: fadeAnim,
              transform: [{ translateY: moveAnim }],
            },
          ]}
        >
          <View style={styles.featureItem}>
            <Ionicons name="people-outline" size={24} color="#9C27B0" />
            <Text style={styles.featureText}>Gestión de estudiantes</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="stats-chart-outline" size={24} color="#9C27B0" />
            <Text style={styles.featureText}>Estadísticas detalladas</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="search-outline" size={24} color="#9C27B0" />
            <Text style={styles.featureText}>Búsqueda avanzada</Text>
          </View>
        </Animated.View>

        {/* Botón Comenzar */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: buttonAnim,
              transform: [
                {
                  scale: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startButtonText}>Comenzar</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Sistema de Gestión Estudiantil</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#9C27B0',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    maxWidth: '80%',
  },
  features: {
    width: '100%',
    marginBottom: 60,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#9C27B0',
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 12,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#9C27B0',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    shadowColor: '#9C27B0',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});