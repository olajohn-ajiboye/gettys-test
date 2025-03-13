import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskForm } from './TaskForm';
import { Task } from '../../types/Task';

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  priority: 'high',
  status: 'in-progress',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TaskForm Component', () => {
  const onSubmitMock = vi.fn();
  const onCancelMock = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    onSubmitMock.mockReset();
    onCancelMock.mockReset();
  });

  it('renders create form correctly when no editing task is provided', () => {
    render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={null}
        onCancel={onCancelMock}
      />
    );

    // Check that the form title is correct
    expect(screen.getByText('Create New Task')).toBeVisible();

    // Check that inputs have default values
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
    expect(screen.getByLabelText('Priority')).toHaveValue('medium');
    expect(screen.getByLabelText('Status')).toHaveValue('todo');

    // Check that create button is present
    expect(screen.getByText('Create Task')).toBeVisible();

    // Check that cancel button is not present when creating
    expect(screen.queryByText('Cancel')).not.toBeVisible();
  });

  it('renders edit form correctly when editing task is provided', () => {
    render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={mockTask}
        onCancel={onCancelMock}
      />
    );

    // Check that the form title is correct
    expect(screen.getByText('Edit Task')).toBeVisible();

    // Check that inputs are populated with task values
    expect(screen.getByLabelText('Title')).toHaveValue(mockTask.title);
    expect(screen.getByLabelText('Description')).toHaveValue(
      mockTask.description
    );
    expect(screen.getByLabelText('Priority')).toHaveValue(mockTask.priority);
    expect(screen.getByLabelText('Status')).toHaveValue(mockTask.status);

    // Check that update button is present
    expect(screen.getByText('Update Task')).toBeVisible();

    // Check that cancel button is present when editing
    expect(screen.getByText('Cancel')).toBeVisible();
  });

  it('calls onSubmit with correct data when creating a new task', async () => {
    render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={null}
        onCancel={onCancelMock}
      />
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'New Task' },
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'New Description' },
    });
    fireEvent.change(screen.getByLabelText('Priority'), {
      target: { value: 'high' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'in-progress' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Create Task'));

    // Check that onSubmit was called with the correct data
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description',
      priority: 'high',
      status: 'in-progress',
    });

    // Check that the form resets after submission
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toHaveValue('');
      expect(screen.getByLabelText('Description')).toHaveValue('');
      expect(screen.getByLabelText('Priority')).toHaveValue('medium');
      expect(screen.getByLabelText('Status')).toHaveValue('todo');
    });
  });

  it('calls onSubmit with correct data when updating a task', () => {
    render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={mockTask}
        onCancel={onCancelMock}
      />
    );

    // Change some values in the form
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Updated Task' },
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'completed' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update Task'));

    // Check that onSubmit was called with the updated data
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).toHaveBeenCalledWith({
      title: 'Updated Task',
      description: mockTask.description,
      priority: mockTask.priority,
      status: 'completed',
    });

    // Form should not reset after update
    expect(screen.getByLabelText('Title')).toHaveValue('Updated Task');
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={mockTask}
        onCancel={onCancelMock}
      />
    );

    // Click the cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Check that onCancel was called
    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('prevents form submission when title is empty', () => {
    render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={null}
        onCancel={onCancelMock}
      />
    );

    // Try to submit the form without filling the required title
    fireEvent.click(screen.getByText('Create Task'));

    // Check that onSubmit was not called
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('updates form fields when editingTask prop changes', () => {
    const { rerender } = render(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={null}
        onCancel={onCancelMock}
      />
    );

  
    expect(screen.getByLabelText('Title')).toHaveValue('');

   
    rerender(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={mockTask}
        onCancel={onCancelMock}
      />
    );


    expect(screen.getByLabelText('Title')).toHaveValue(mockTask.title);

    const differentTask: Task = {
      ...mockTask,
      id: '2',
      title: 'Different Task',
      priority: 'low',
    };

    rerender(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={differentTask}
        onCancel={onCancelMock}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue('Different Task');
    expect(screen.getByLabelText('Priority')).toHaveValue('low');

    rerender(
      <TaskForm
        onSubmit={onSubmitMock}
        editingTask={null}
        onCancel={onCancelMock}
      />
    );

    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Priority')).toHaveValue('medium');
  });
});
