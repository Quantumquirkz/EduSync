import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { GROQ_API_KEY } from '../config';

export type Message = { role: 'user' | 'assistant'; content: string };

type ChatNavProp = NativeStackNavigationProp<RootStackParamList, 'Chatbot'>;

export default function ChatbotScreen() {
  const navigation = useNavigation<ChatNavProp>();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: '¡Hola! Soy Gladys, tu asistente IA. Pregúntame lo que necesites sobre la base de datos de estudiantes o cualquier otra duda.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await globalThis.fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'system',
              content: 'Eres Gladys, una asistente IA que ayuda a consultar la base de datos de estudiantes. Usa los datos proporcionados en el contexto cuando sea necesario. Si no sabes la respuesta con certeza, responde que no tienes suficiente información.'
            },
            ...messages,
            userMsg
          ],
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: false
        })
      });
      const json = await res.json();
      const assistantContent = json.choices?.[0]?.message?.content || 'Sin respuesta';
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
    } catch (err) {
      console.error('Chatbot error', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al obtener respuesta' }]);
    } finally {
      setLoading(false);
      flatRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }: { item: Message }) => (
    <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistBubble]}>
      <Text style={styles.bubbleText}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Gladys</Text>
      </View>
      <FlatList
        ref={flatRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.chatContainer}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#888"
            editable={!loading}
          />
          <TouchableOpacity onPress={sendMessage} disabled={loading || !input.trim()} style={styles.sendButton}>
            <Ionicons name="send" size={24} color={loading ? '#888' : '#4A148C'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#4A148C' },
  backButton: { marginRight: 12 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatContainer: { padding: 12 },
  bubble: { marginVertical: 4, padding: 10, borderRadius: 8, maxWidth: '80%' },
  userBubble: { backgroundColor: '#2196F3', alignSelf: 'flex-end' },
  assistBubble: { backgroundColor: '#333', alignSelf: 'flex-start' },
  bubbleText: { color: '#fff', fontSize: 14 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderColor: '#222', backgroundColor: '#111' },
  input: { flex: 1, color: '#fff', padding: 8, backgroundColor: '#1a1a1a', borderRadius: 20, marginRight: 8 },
  sendButton: { padding: 8 },
});