import app from './app';

//decouple the app and the running server, so your tests can import the app without starting the server

const PORT = 9000;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });