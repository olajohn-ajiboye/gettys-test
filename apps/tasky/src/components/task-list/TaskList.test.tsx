
import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TaskList } from './TaskList';
import { Task } from '../../types/Task';
import {ConfirmationDialogProps} from './ConfirmationDialog'
import { TaskEditModalProps } from './TaskEditModal';


vi.mock('./ConfirmationDialog', () => ({
  ConfirmationDialog: ({
    isOpen,
    onConfirm,
    onCancel,
  }: ConfirmationDialogProps) =>
    isOpen ? (
      <div data-testid='confirmation-dialog'>
        <button onClick={onConfirm} data-testid='confirm-delete'>
          Delete
        </button>
        <button onClick={onCancel} data-testid='cancel-delete'>
          Cancel
        </button>
      </div>
    ) : null,
}));

vi.mock('./TaskEditModal', () => ({
  TaskEditModal: ({ task, onSubmit, onClose }: TaskEditModalProps) => (
    <div data-testid='edit-modal'>
      <h2>Edit Task: {task.title}</h2>
      <button
        onClick={() => onSubmit({ ...task, title: 'Updated Title' })}
        data-testid='save-edit'
      >
        Save
      </button>
      <button onClick={onClose} data-testid='close-edit'>
        Cancel
      </button>
    </div>
  ),
}));


const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project',
    description: 'Finish the React project',
    status: 'todo',
    priority: 'high',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    description: 'Study advanced TypeScript concepts',
    status: 'in-progress',
    priority: 'medium',
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-12'),
  },
  {
    id: '3',
    title: 'Exercise',
    description: 'Go for a 30 minute run',
    status: 'completed',
    priority: 'low',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-16'),
  },
];

describe('TaskList Component', () => {
  // Mock handlers
  const onDeleteMock = vi.fn();
  const onEditMock = vi.fn();
  const onStatusChangeMock = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    onDeleteMock.mockReset();
    onEditMock.mockReset();
    onStatusChangeMock.mockReset();
  });

  it('renders the task list with all tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    // Check that all task titles are rendered
    expect(screen.getByText('Complete project')).toBeInTheDocument();
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Exercise')).toBeInTheDocument();


    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('Updated')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('filters tasks by status', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    // Initially all tasks should be visible
    expect(screen.getAllByRole('row')).toHaveLength(4);

    // Filter by 'todo' status
    const statusFilter = screen.getByLabelText('Status:');
    fireEvent.change(statusFilter, { target: { value: 'todo' } });

    // Should only show tasks with todo status
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 task + header row
    expect(screen.getByText('Complete project')).toBeInTheDocument();
    expect(screen.queryByText('Learn TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('Exercise')).not.toBeInTheDocument();
  });

  it('filters tasks by priority', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    // Filter by 'high' priority
    const priorityFilter = screen.getByLabelText('Priority:');
    fireEvent.change(priorityFilter, { target: { value: 'high' } });

    // Should only show tasks with high priority
    expect(screen.getAllByRole('row')).toHaveLength(2); // 1 task + header row
    expect(screen.getByText('Complete project')).toBeInTheDocument();
    expect(screen.queryByText('Learn TypeScript')).not.toBeInTheDocument();
    expect(screen.queryByText('Exercise')).not.toBeInTheDocument();
  });

  it('handles combination of status and priority filters', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    const statusFilter = screen.getByLabelText('Status:');
    fireEvent.change(statusFilter, { target: { value: 'in-progress' } });

    const priorityFilter = screen.getByLabelText('Priority:');
    fireEvent.change(priorityFilter, { target: { value: 'medium' } });

    // Should only show tasks with both filters matching
    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.queryByText('Complete project')).not.toBeInTheDocument();
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('Exercise')).not.toBeInTheDocument();
  });

  it('searches tasks by title and description', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'type' } });

    expect(screen.getAllByRole('row')).toHaveLength(2);
    expect(screen.queryByText('Complete project')).not.toBeInTheDocument();
    expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
    expect(screen.queryByText('Exercise')).not.toBeInTheDocument();
  });

  it('displays a message when no tasks match filters', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent task' } });

    // Should show "No tasks found" message
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });

  it('changes task status', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    // Find the row with "Complete project" and change its status
    const rows = screen.getAllByRole('row');
    const targetRow = rows.find((row) =>
      within(row).queryByText('Complete project')
    );

    const statusSelect = within(targetRow!).getByRole('combobox');
    expect(statusSelect).toHaveValue('todo');

    fireEvent.change(statusSelect, { target: { value: 'in-progress' } });

    expect(onStatusChangeMock).toHaveBeenCalledWith('1', 'in-progress');
  });

  it('opens delete confirmation dialog when delete button is clicked', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    expect(screen.queryByTestId('confirmation-dialog')).not.toBeInTheDocument();


    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
    expect(screen.getByTestId('confirmation-dialog')).toBeInTheDocument();
  });

  it('deletes a task when confirmed', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    const confirmButton = screen.getByTestId('confirm-delete');
    fireEvent.click(confirmButton);

    expect(onDeleteMock).toHaveBeenCalledWith('1');

    expect(screen.queryByTestId('confirmation-dialog')).not.toBeInTheDocument();
  });

  it('cancels task deletion', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    const cancelButton = screen.getByTestId('cancel-delete');
    fireEvent.click(cancelButton);

    expect(onDeleteMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('confirmation-dialog')).not.toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    // Initially edit modal should not be visible
    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();

    // Find and click the edit button for a task
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Edit modal should now be visible with the task title
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Edit Task: Complete project')).toBeInTheDocument();
  });

  it('edits a task when changes are submitted', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    const saveButton = screen.getByTestId('save-edit');
    fireEvent.click(saveButton);


    expect(onEditMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: '1',
        title: 'Updated Title'
      })
    );

    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });

  it('closes edit modal without saving', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    const closeButton = screen.getByTestId('close-edit');
    fireEvent.click(closeButton);

    expect(onEditMock).not.toHaveBeenCalled();
    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });

  it('shows empty state when tasks array is empty', () => {
    render(
      <TaskList
        tasks={[]}
        onDelete={onDeleteMock}
        onEdit={onEditMock}
        onStatusChange={onStatusChangeMock}
      />
    );

    expect(screen.getByText('No tasks found')).toBeInTheDocument();
  });
});
