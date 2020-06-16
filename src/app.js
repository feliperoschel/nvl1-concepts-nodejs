const express = require('express');
const cors = require('cors');

const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) =>
  response.status(200).send(repositories)
);

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.status(201).send(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find((item) => item.id === id);

  if (!repository) {
    return response.status(400).send({ message: 'Repository does not exist!' });
  }

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  response.status(200).send(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex((item) => item.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).send({ message: 'Repository does not exist!' });
  }

  repositories.splice(repositoryIndex, 1);

  response.status(204).send([]);
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((item) => item.id === id);

  if (!repository) {
    return response.status(400).send({ message: 'Repository does not exist!' });
  }

  repository.likes += 1;

  response.status(201).send({ likes: repository.likes });
});

module.exports = app;
