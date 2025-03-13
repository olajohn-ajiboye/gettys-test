import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  FilterFn,
} from '@tanstack/react-table';

import { ConfirmationDialog } from './ConfirmationDialog';
import { TaskEditModal } from './TaskEditModal';
import { Task } from '../../types/Task';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onEdit,
  onStatusChange,
}) => {
  // Table state
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'createdAt', desc: true },
  ]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<Task['status'] | 'all'>(
    'all'
  );
  const [priorityFilter, setPriorityFilter] = useState<
    Task['priority'] | 'all'
  >('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    taskId: string | null;
  }>({ isOpen: false, taskId: null });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    task: Task | null;
  }>({ isOpen: false, task: null });

  // Column helper
  const columnHelper = createColumnHelper<Task>();

  // Global filter function for search
  const globalFilterFn: FilterFn<Task> = (row, columnId, filterValue) => {
    const search = String(filterValue).toLowerCase();
    const title = row.getValue<string>('title')?.toLowerCase() || '';
    const description =
      row.getValue<string>('description')?.toLowerCase() || '';
    return title.includes(search) || description.includes(search);
  };

  // Define columns
  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => (
        <select
          value={info.getValue()}
          onChange={(e) =>
            onStatusChange(
              info.row.original.id,
              e.target.value as Task['status']
            )
          }
          className={`status-badge status-${info.getValue()}`}
        >
          <option value='todo'>To Do</option>
          <option value='in-progress'>In Progress</option>
          <option value='completed'>Completed</option>
        </select>
      ),
    }),
    columnHelper.accessor('priority', {
      header: 'Priority',
      cell: (info) => (
        <span className={`priority-badge priority-${info.getValue()}`}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor('updatedAt', {
      header: 'Updated',
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className='action-cell'>
          <button
            className='edit-button'
            onClick={() => handleEditClick(info.row.original)}
          >
            Edit
          </button>
          <button
            className='delete-button'
            onClick={() => handleDeleteClick(info.row.original.id)}
          >
            Delete
          </button>
        </div>
      ),
    }),
  ];

  // Format dates
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  // Action handlers
  const handleDeleteClick = (id: string) => {
    setDeleteConfirmation({ isOpen: true, taskId: id });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.taskId) {
      onDelete(deleteConfirmation.taskId);
    }
    setDeleteConfirmation({ isOpen: false, taskId: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, taskId: null });
  };

  const handleEditClick = (task: Task) => {
    setEditModal({ isOpen: true, task });
  };

  const handleEditSubmit = (task: Task) => {
    onEdit(task);
    setEditModal({ isOpen: false, task: null });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, task: null });
  };

  // Pre-filter tasks based on status and priority filters
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      let keepTask = true;

      if (statusFilter !== 'all' && task.status !== statusFilter) {
        keepTask = false;
      }

      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        keepTask = false;
      }

      return keepTask;
    });
  }, [tasks, statusFilter, priorityFilter]);

  // Initialize table
  const table = useReactTable({
    data: filteredTasks,
    columns,
    state: {
      sorting,
      globalFilter: searchTerm,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setSearchTerm,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className='task-list-container'>
      <div className='task-filters'>
        <div className='search-container'>
          <input
            type='text'
            placeholder='Search tasks...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
        </div>

        <div className='filter-controls'>
          <div className='filter-group'>
            <label htmlFor='status-filter'>Status:</label>
            <select
              id='status-filter'
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as Task['status'] | 'all')
              }
              className='filter-select'
            >
              <option value='all'>All</option>
              <option value='todo'>To Do</option>
              <option value='in-progress'>In Progress</option>
              <option value='completed'>Completed</option>
            </select>
          </div>

          <div className='filter-group'>
            <label htmlFor='priority-filter'>Priority:</label>
            <select
              id='priority-filter'
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(e.target.value as Task['priority'] | 'all')
              }
              className='filter-select'
            >
              <option value='all'>All</option>
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>
        </div>
      </div>

      <div className='task-table-container'>
        <table className='task-table'>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getCanSort() ? 'sortable' : ''}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getIsSorted() && (
                      <span>
                        {header.column.getIsSorted() === 'asc' ? ' ↑' : ' ↓'}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={7} className='no-tasks'>
                  No tasks found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`priority-${row.original.priority}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        title='Confirm Delete'
        message='Are you sure you want to delete this task? This action cannot be undone.'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {editModal.isOpen && editModal.task && (
        <TaskEditModal
          task={editModal.task}
          onSubmit={handleEditSubmit}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
};
