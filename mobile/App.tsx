import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string
}

function Button( { title }: ButtonProps) {
  return (
    <TouchableOpacity>
      <Text  style={styles.button}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello NLW eSports</Text>

      <Button title='Next' />
      <Button title='Level' />
      <Button title='Week' />

      <StatusBar style="auto" backgroundColor='#fff'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
  },
  button: {
    color: '#000',
    fontSize: 22,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 30,
    borderRadius: 12,
  },
});
