import { Box, Typography, TextField, Button, Grid, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import { useState, ChangeEvent } from 'react';

interface Todo {
  index: number;
  topic: string;
  name: string;
  url: string;
  detail: string;
  done: boolean;
}

const MAX_DISPLAY_LINES = 4; // Number of lines to display before truncating

function App() {
  const [index, setIndex] = useState<number>(-1);
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [topic, setTopic] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [detail, setDetail] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

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

  const handleSubmit = () => {
      setIndex(index + 1);
      const newTodo: Todo = { index, topic, name, url, detail, done: false };
      setTodos([...todos, newTodo]);
      handleReset();
    
  };

  const handleReset = () => {
    setTopic('');
    setName('');
    setUrl('');
    setDetail('');
    setError(false);
  };

  const handleDelete = (x: number) => {
    const updatedTodos = todos.filter((_, index) => index !== x);
    setTodos(updatedTodos);
  };


  const handleDone = (x: number) => {
      const updatedTodos = todos.map((todo, index) =>
      index === x ? { ...todo, done: !todo.done } : todo
      );
      setTodos(updatedTodos);
  };

  const handleExpandClick = (index: number) => {
      setExpanded(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const isFormValid = () => {
      return topic.trim() !== '' && name.trim() !== '' && url.trim() !== '' && !error ;
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
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: expanded[index] ? 'none' : MAX_DISPLAY_LINES, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {todo.detail}
                  </Typography>
                  </CardContent>
                  <CardActions>
                  <Button size="small" onClick={() => handleExpandClick(index)}>
                      {expanded[index] ? 'Show Less' : 'Show More'}
                  </Button>
                  <Button size="small" onClick={() => handleDone(index)}>{todo.done ? 'Undo' : 'Done'}</Button>
                  <Button size="small" onClick={() => handleDelete(index)}>Delete</Button>
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
