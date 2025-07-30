import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toast } from 'sonner-native';
import { RootStackParamList } from '../App';
import supabase from '../supabaseClient';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  phone?: string;
  bio?: string;
}

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarOptions, setAvatarOptions] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(false);
  
  // Animated values
  const avatarScale = useSharedValue(1);
  const editButtonScale = useSharedValue(1);
  const headerOpacity = useSharedValue(0);

  useEffect(() => {
    fetchProfile();
    headerOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch additional profile data from profiles table if it exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || profileData?.full_name || 'Usuario',
          avatar_url: user.user_metadata?.avatar_url || profileData?.avatar_url,
          created_at: user.created_at,
          phone: user.user_metadata?.phone || profileData?.phone || '',
          bio: user.user_metadata?.bio || profileData?.bio || '',
        });
        
        setEditedProfile({
          full_name: user.user_metadata?.full_name || profileData?.full_name || 'Usuario',
          phone: user.user_metadata?.phone || profileData?.phone || '',
          bio: user.user_metadata?.bio || profileData?.bio || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await supabase.auth.signOut();
              toast.success('Sesión cerrada exitosamente');
              navigation.navigate('Welcome');
            } catch (error) {
              toast.error('Error al cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEditProfile = () => {
    // Animate button press
    editButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    setEditModalVisible(true);
  };

  const handleChangePassword = () => {
    setPasswordModalVisible(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setActivityIndicator(true);
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: editedProfile.full_name,
          phone: editedProfile.phone,
          bio: editedProfile.bio,
        }
      });

      if (updateError) throw updateError;

      // Also update or insert into profiles table for redundancy
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: profile?.id,
          full_name: editedProfile.full_name,
          phone: editedProfile.phone,
          bio: editedProfile.bio,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;

      // Update local state
      setProfile(prev => prev ? {
        ...prev,
        full_name: editedProfile.full_name || prev.full_name,
        phone: editedProfile.phone || prev.phone,
        bio: editedProfile.bio || prev.bio,
      } : null);

      toast.success('Perfil actualizado exitosamente');
      setEditModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setActivityIndicator(false);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setPasswordError('');
      
      // Validate passwords
      if (!currentPassword) {
        setPasswordError('Ingresa tu contraseña actual');
        return;
      }
      
      if (!newPassword) {
        setPasswordError('Ingresa una nueva contraseña');
        return;
      }
      
      if (newPassword.length < 6) {
        setPasswordError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setPasswordError('Las contraseñas no coinciden');
        return;
      }
      
      setActivityIndicator(true);
      
      // Update password
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;
      
      toast.success('Contraseña actualizada exitosamente');
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      if (error.message.includes('auth')) {
        setPasswordError('La contraseña actual es incorrecta');
      } else {
        setPasswordError('Error al actualizar la contraseña');
      }
    } finally {
      setActivityIndicator(false);
    }
  };

  const handleAvatarPress = () => {
    // Animate avatar press
    avatarScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    setAvatarOptions(true);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0].base64) {
        await uploadAvatar(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      toast.error('Error al seleccionar imagen');
    } finally {
      setAvatarOptions(false);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        toast.error('Se requiere permiso para acceder a la cámara');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0].base64) {
        await uploadAvatar(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast.error('Error al tomar foto');
    } finally {
      setAvatarOptions(false);
    }
  };

  const uploadAvatar = async (base64Image: string) => {
    try {
      if (!profile?.id) return;
      
      setUploading(true);
      
      // Convert base64 to ArrayBuffer
      const fileExt = 'jpg';
      const fileName = `${profile.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64Image), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update user metadata with avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });
      
      if (updateError) throw updateError;
      
      // Also update profiles table
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        });
        
      if (upsertError) throw upsertError;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
      toast.success('Avatar actualizado exitosamente');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Error al subir avatar');
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    try {
      if (!profile?.id) return;
      
      setUploading(true);
      
      // Update user metadata to remove avatar URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      });
      
      if (updateError) throw updateError;
      
      // Also update profiles table
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          avatar_url: null,
          updated_at: new Date().toISOString(),
        });
        
      if (upsertError) throw upsertError;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: undefined } : null);
      
      toast.success('Avatar eliminado exitosamente');
    } catch (error) {
      console.error('Error removing avatar:', error);
      toast.error('Error al eliminar avatar');
    } finally {
      setUploading(false);
      setAvatarOptions(false);
    }
  };

  // Animated styles
  const animatedAvatarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    };
  });

  const animatedEditButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: editButtonScale.value }],
    };
  });

  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
    };
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9C27B0" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, animatedHeaderStyle]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Animated.View style={[styles.avatarContainer, animatedAvatarStyle]}>
            {uploading ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator size="large" color="#9C27B0" />
              </View>
            ) : profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#9C27B0" />
              </View>
            )}
            <TouchableOpacity 
              style={styles.editAvatarButton}
              onPress={handleAvatarPress}
              disabled={uploading}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.userName}>{profile?.full_name}</Text>
          <Text style={styles.userEmail}>{profile?.email}</Text>
          {profile?.bio && (
            <Text style={styles.userBio}>{profile.bio}</Text>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={20} color="#9C27B0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{profile?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={20} color="#9C27B0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre Completo</Text>
              <Text style={styles.infoValue}>{profile?.full_name}</Text>
            </View>
          </View>

          {profile?.phone && (
            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={20} color="#9C27B0" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            </View>
          )}

          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#9C27B0" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Miembro desde</Text>
              <Text style={styles.infoValue}>
                {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones</Text>
          
          <Animated.View style={animatedEditButtonStyle}>
            <TouchableOpacity 
              style={styles.actionItem}
              onPress={handleEditProfile}
            >
              <Ionicons name="create-outline" size={20} color="#4CAF50" />
              <Text style={styles.actionText}>Editar Perfil</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={handleChangePassword}
          >
            <Ionicons name="key-outline" size={20} color="#2196F3" />
            <Text style={styles.actionText}>Cambiar Contraseña</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={20} color="#FF9800" />
            <Text style={styles.actionText}>Configuración</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionItem, styles.signOutItem]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color="#f44336" />
            <Text style={[styles.actionText, styles.signOutText]}>Cerrar Sesión</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la App</Text>
          <View style={styles.appInfo}>
            <Text style={styles.appInfoText}>Sistema de Gestión Estudiantil</Text>
            <Text style={styles.appInfoText}>Versión 1.0.0</Text>
            <Text style={styles.appInfoText}>Desarrollado por Grupo 1IL-128</Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombre Completo</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.full_name}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, full_name: text }))}
                  placeholder="Ingresa tu nombre completo"
                  placeholderTextColor="#666"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Teléfono</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.phone}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                  placeholder="Ingresa tu número de teléfono"
                  placeholderTextColor="#666"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Biografía</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, bio: text }))}
                  placeholder="Cuéntanos sobre ti"
                  placeholderTextColor="#666"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleUpdateProfile}
              disabled={activityIndicator}
            >
              {activityIndicator ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cambiar Contraseña</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setPasswordError('');
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView}>
              {passwordError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              ) : null}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña Actual</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Ingresa tu contraseña actual"
                    placeholderTextColor="#666"
                    secureTextEntry={!showCurrentPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    <Ionicons 
                      name={showCurrentPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9C27B0" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nueva Contraseña</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Ingresa tu nueva contraseña"
                    placeholderTextColor="#666"
                    secureTextEntry={!showNewPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <Ionicons 
                      name={showNewPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9C27B0" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Confirmar Contraseña</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirma tu nueva contraseña"
                    placeholderTextColor="#666"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9C27B0" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.passwordRequirements}>
                La contraseña debe tener al menos 6 caracteres.
              </Text>
            </ScrollView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleUpdatePassword}
              disabled={activityIndicator}
            >
              {activityIndicator ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Options Modal */}
      <Modal
        visible={avatarOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAvatarOptions(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAvatarOptions(false)}
        >
          <View style={styles.avatarOptionsContainer}>
            <TouchableOpacity 
              style={styles.avatarOption}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={24} color="#9C27B0" />
              <Text style={styles.avatarOptionText}>Elegir de la galería</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.avatarOption}
              onPress={takePhoto}
            >
              <Ionicons name="camera-outline" size={24} color="#9C27B0" />
              <Text style={styles.avatarOptionText}>Tomar foto</Text>
            </TouchableOpacity>
            
            {profile?.avatar_url && (
              <TouchableOpacity 
                style={[styles.avatarOption, styles.removeAvatarOption]}
                onPress={removeAvatar}
              >
                <Ionicons name="trash-outline" size={24} color="#f44336" />
                <Text style={styles.removeAvatarText}>Eliminar avatar</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setAvatarOptions(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
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
  settingsButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#9C27B0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    flex: 1,
  },
  signOutItem: {
    borderWidth: 1,
    borderColor: '#f44336',
  },
  signOutText: {
    color: '#f44336',
  },
  appInfo: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  appInfoText: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: Dimensions.get('window').height * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#9C27B0',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
  },
  passwordRequirements: {
    fontSize: 12,
    color: '#aaa',
    marginTop: -10,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  avatarOptionsContainer: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  avatarOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  avatarOptionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
  },
  removeAvatarOption: {
    borderBottomWidth: 0,
  },
  removeAvatarText: {
    fontSize: 16,
    color: '#f44336',
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#333',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});