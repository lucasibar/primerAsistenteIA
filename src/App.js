
import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

function App() {
  const [mensaje, setMensaje] = useState('');
  const [respuesta, setRespuesta] = useState('');

  const enviarMensajeStream = async () => {
    setRespuesta('');
    const response = await fetch('http://localhost:3000/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunk = decoder.decode(value);
      setRespuesta((prev) => prev + chunk);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Asistente Inteligente
      </Typography>

      <TextField
        fullWidth
        label="Escribí tu mensaje"
        variant="outlined"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={enviarMensajeStream}>
        Enviar (Streaming)
      </Button>

      {respuesta && (
        <Box mt={4}>
          <Typography variant="h6">Respuesta del agente:</Typography>
          <Typography>{respuesta}</Typography>
        </Box>
      )}
    </Container>
  );
}

export default App;
