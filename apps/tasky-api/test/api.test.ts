import request from 'supertest';

import app from '../src/app';

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        message: 'API - 👋🌎🌍🌏',
      }, done);
  });
});

describe('GET /api/v1/tasks', () => {
  it('responds with an empty array initially', (done) => {
    request(app)
      .get('/api/v1/tasks')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body).toEqual([]);
        done();
      })
      .catch(err => done(err));
  });
});

describe('POST /api/v1/tasks', () => {
  it('creates a new task with valid data', (done) => {
    const newTask = {
      title: 'Test Task',
      description: 'Test Description',
      priority: 'high',
      status: 'in-progress',
    };

    request(app)
      .post('/api/v1/tasks')
      .send(newTask)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body.title).toEqual(newTask.title);
        expect(response.body.description).toEqual(newTask.description);
        expect(response.body.priority).toEqual(newTask.priority);
        expect(response.body.status).toEqual(newTask.status);
        expect(response.body.id).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
        done();
      })
      .catch(err => done(err));
  });

  it('returns error when title is missing', (done) => {
    const invalidTask = {
      description: 'No title here',
      priority: 'low',
    };

    request(app)
      .post('/api/v1/tasks')
      .send(invalidTask)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Title is required',
      }, done);
  });

  it('creates task with default values when not provided', (done) => {
    const minimalTask = {
      title: 'Minimal Task',
    };

    request(app)
      .post('/api/v1/tasks')
      .send(minimalTask)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .then(response => {
        expect(response.body.title).toEqual(minimalTask.title);
        expect(response.body.description).toEqual('');
        expect(response.body.priority).toEqual('medium');
        expect(response.body.status).toEqual('todo');
        done();
      })
      .catch(err => done(err));
  });
});

describe('GET /api/v1/tasks/:id', () => {
  let createdTaskId: string;

  beforeEach((done) => {
    // Create a task to test with
    request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Test Task for GET' })
      .then(response => {
        createdTaskId = response.body.id;
        done();
      })
      .catch(err => done(err));
  });

  it('retrieves an existing task by id', (done) => {
    request(app)
      .get(`/api/v1/tasks/${createdTaskId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.id).toEqual(createdTaskId);
        expect(response.body.title).toEqual('Test Task for GET');
        done();
      })
      .catch(err => done(err));
  });

  it('returns 404 for non-existent task id', (done) => {
    request(app)
      .get('/api/v1/tasks/non-existent-id')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, {
        error: 'Task not found',
      }, done);
  });
});

describe('PUT /api/v1/tasks/:id', () => {
  let createdTaskId: string;

  beforeEach((done) => {
    // Create a task to test with
    request(app)
      .post('/api/v1/tasks')
      .send({
        title: 'Task to Update',
        description: 'Original description',
        priority: 'low',
        status: 'todo',
      })
      .then(response => {
        createdTaskId = response.body.id;
        done();
      })
      .catch(err => done(err));
  });

  it('updates an existing task', (done) => {
    const updatedData = {
      title: 'Updated Task Title',
      description: 'Updated description',
      priority: 'high',
      status: 'done',
    };

    request(app)
      .put(`/api/v1/tasks/${createdTaskId}`)
      .send(updatedData)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.id).toEqual(createdTaskId);
        expect(response.body.title).toEqual(updatedData.title);
        expect(response.body.description).toEqual(updatedData.description);
        expect(response.body.priority).toEqual(updatedData.priority);
        expect(response.body.status).toEqual(updatedData.status);
        done();
      })
      .catch(err => done(err));
  });

  it('returns 404 when updating non-existent task', (done) => {
    request(app)
      .put('/api/v1/tasks/non-existent-id')
      .send({ title: 'Updated Title' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, {
        error: 'Task not found',
      }, done);
  });

  it('returns error when updating with empty title', (done) => {
    request(app)
      .put(`/api/v1/tasks/${createdTaskId}`)
      .send({ title: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {
        error: 'Title cannot be empty',
      }, done);
  });

  it('partially updates a task with only provided fields', (done) => {
    request(app)
      .put(`/api/v1/tasks/${createdTaskId}`)
      .send({ status: 'in-progress' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        expect(response.body.id).toEqual(createdTaskId);
        expect(response.body.title).toEqual('Task to Update'); // Unchanged
        expect(response.body.description).toEqual('Original description'); // Unchanged
        expect(response.body.priority).toEqual('low'); // Unchanged
        expect(response.body.status).toEqual('in-progress'); // Changed
        done();
      })
      .catch(err => done(err));
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  let createdTaskId: string;

  beforeEach((done) => {
    // Create a task to test with
    request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Task to Delete' })
      .then(response => {
        createdTaskId = response.body.id;
        done();
      })
      .catch(err => done(err));
  });

  it('deletes an existing task', (done) => {
    request(app)
      .delete(`/api/v1/tasks/${createdTaskId}`)
      .expect(204)
      .then(() => {
        // Verify task is deleted by attempting to get it
        request(app)
          .get(`/api/v1/tasks/${createdTaskId}`)
          .expect(404, {
            error: 'Task not found',
          }, done);
      })
      .catch(err => done(err));
  });

  it('returns 404 when deleting non-existent task', (done) => {
    request(app)
      .delete('/api/v1/tasks/non-existent-id')
      .expect(404, {
        error: 'Task not found',
      }, done);
  });
});
