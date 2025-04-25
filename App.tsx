import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

const alturaStatusBar = StatusBar.currentHeight;

export default function App() {
  const [load, defLoad] = useState(false);
  const [receita, defReceita] = useState('');

  const [ingr1, defIngr1] = useState('');
  const [ingr2, defIngr2] = useState('');
  const [ingr3, defIngr3] = useState('');
  const [ingr4, defIngr4] = useState('');
  const [ocasiao, defOcasiao] = useState('');

  const KEY_GPT = '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'; // Substitua pela sua chave real

  async function gerarReceita() {
    if (ingr1 === '' || ingr2 === '' || ingr3 === '' || ingr4 === '' || ocasiao === '') {
      Alert.alert('Atenção', 'Informe todos os ingredientes!', [{ text: 'ok' }]);
      return;
    }

    defReceita('');
    defLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma receita detalhada para o ${ocasiao} usando os ingredientes: ${ingr1}, ${ingr2}, ${ingr3} e ${ingr4} e pesquise a receita no YouTube. Caso encontre, informe o link.`;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${KEY_GPT}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // ou 'gpt-3.5-turbo'
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
          top_p: 1,
        }),
      });

      const data = await response.json();
      console.log('🔍 Resposta da API:', data);

      if (data?.choices?.[0]?.message?.content) {
        defReceita(data.choices[0].message.content);
      } else {
        defReceita('Não foi possível gerar a receita. Tente novamente.');
      }
    } catch (error) {
      console.log('Erro ao chamar a API:', error);
      defReceita('Erro ao buscar a receita. Verifique sua conexão ou tente mais tarde.');
    } finally {
      defLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={ESTILOS.header}>Cozinha fácil</Text>
      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os ingredientes abaixo:</Text>
        <TextInput
          placeholder="Ingrediente 1"
          style={ESTILOS.input}
          value={ingr1}
          onChangeText={defIngr1}
        />
        <TextInput
          placeholder="Ingrediente 2"
          style={ESTILOS.input}
          value={ingr2}
          onChangeText={defIngr2}
        />
        <TextInput
          placeholder="Ingrediente 3"
          style={ESTILOS.input}
          value={ingr3}
          onChangeText={defIngr3}
        />
        <TextInput
          placeholder="Ingrediente 4"
          style={ESTILOS.input}
          value={ingr4}
          onChangeText={defIngr4}
        />
        <TextInput
          placeholder="Almoço ou Jantar"
          style={ESTILOS.input}
          value={ocasiao}
          onChangeText={defOcasiao}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarReceita}>
        <Text style={ESTILOS.buttonText}>Gerar receita</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}
        style={ESTILOS.containerScroll}
        showsVerticalScrollIndicator={false}
      >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Produzindo receita...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {receita && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Sua receita 👇</Text>
            <Text style={{ lineHeight: 24 }}>{receita}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const ESTILOS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54,
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#FF5656',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  },
});
