import { Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { useState, useEffect, ChangeEvent } from "react"
import axios from 'axios';
import React from 'react';

interface Todo {
  id: number;
  topic: string;
  name: string;
  url: string;
  detail: string;
  done: boolean;
}

const MAX_DISPLAY_LINES = 4; // Number of lines to display before truncating

function App() {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get('http://localhost:2222/todos');
    setTodos(response.data);
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setUrl(value);
    const isValid = /\.(jpeg|jpg|png)$/i.test(value) || /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(value);
    setError(!isValid);
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setName(value);
  };

  const handleTopicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setTopic(value);
  };

  const handleDetailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDetail(value);
  };

  const handleSubmit = async () => {
    const newTodo = { topic, name, url, detail, done: false };
    const response = await axios.post('http://localhost:2222/todos', newTodo);
    setTodos([...todos, response.data]);
    handleReset();
  };

  const handleReset = () => {
    setTopic('');
    setName('');
    setUrl('');
    setDetail('');
    setError(false);
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`http://localhost:2222/todos/${id}`);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleDone = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      const updatedTodo = { ...todo, done: !todo.done };
      const response = await axios.put(`http://localhost:2222/todos/${id}`, updatedTodo);
      setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
    }
  };

  const handleExpandClick = (id: number) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isFormValid = () => {
    return topic.trim() !== '' && name.trim() !== '' && url.trim() !== '' && !error;
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Grid container spacing={2} sx={{ width: '80%' }}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ mb: 4, textAlign: 'center' }}>
              Todo_Card
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mx: 'auto' }}>
            <TextField
              required
              id="outlined-required"
              label="Topic"
              value={topic}
              onChange={handleTopicChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mx: 'auto' }}>
            <TextField
              required
              id="outlined-required"
              label="Name"
              value={name}
              onChange={handleNameChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ mx: 'auto' }}>
            <TextField
              id="outlined-url-input"
              label="Image URL"
              type="url"
              value={url}
              onChange={handleUrlChange}
              error={error}
              helperText={error ? 'Please enter a valid image URL (.jpeg, .png) or link' : 'Enter an image URL'}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ mx: 'auto' }}>
            <TextField
              id="outlined-multiline-static"
              label="Detail"
              multiline
              value={detail}
              rows={4}
              onChange={handleDetailChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            <Button onClick={handleSubmit} variant="contained" color="success" sx={{ padding: '16px 32px', fontSize: '1rem', minWidth: '150px' }} disabled={!isFormValid()}>
              Submit
            </Button>
            <Button onClick={handleReset} variant="outlined" color="error" sx={{ padding: '16px 32px', fontSize: '1rem', minWidth: '150px' }}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Grid container spacing={2}>
          {todos.map((todo, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 'fullwidth', opacity: todo.done ? 0.5 : 1, margin: 'auto' }}>
                <CardMedia
                  sx={{ height: 300 }}
                  image={todo.url}
                  title={todo.topic}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {todo.topic} of {todo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: expanded[todo.id] ? 'none' : MAX_DISPLAY_LINES, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {todo.detail}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => handleExpandClick(todo.id)}>
                    {expanded[todo.id] ? 'Show Less' : 'Show More'}
                  </Button>
                  <Button size="small" onClick={() => handleDone(todo.id)}>{todo.done ? 'Undo' : 'Done'}</Button>
                  <Button size="small" onClick={() => handleDelete(todo.id)}>Delete</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default App;
