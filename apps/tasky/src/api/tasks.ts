import { Task } from "../types/Task";

const API_URL =  "http://localhost:5000/api/v1"



export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_URL}/tasks`);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    const data = await response.json();
    return data;
};

export const fetchTaskById = async (id: string): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch task');
    }
    const data = await response.json();
    return data;
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    const data = await response.json();
    return data;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    const data = await response.json();
    return data;
};

export const deleteTask = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
};