import app from './app';

const port = process.env.PORT || 8888;

app.listen(port, (err) => {
  if (!err) {
    console.log(`Server is listening ${port}`);
  }
});
