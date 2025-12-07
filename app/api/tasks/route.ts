import { NextResponse } from 'next/server';
import { tasksApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tasks - Get all tasks
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    // Auto-login for development
    let token = '';
    try {
      const loginResponse = await authApi.login('admin', 'admin');
      token = loginResponse.access_token;
    } catch (error) {
      console.error('Auto-login failed:', error);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const tasks = await tasksApi.getAll(token);

    // Filter by date if provided
    let filteredTasks = tasks;
    if (date) {
      filteredTasks = tasks.filter((task) => task.date === date);
    }
    if (status && status !== 'all') {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    return NextResponse.json(filteredTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tasks - Create a new task
 */
export async function POST(request: Request) {
  try {
    // Auto-login for development
    let token = '';
    try {
      const loginResponse = await authApi.login('admin', 'admin');
      token = loginResponse.access_token;
    } catch (error) {
      console.error('Auto-login failed:', error);
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const newTask = await tasksApi.create(token, body);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating task:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
    return NextResponse.json(
      { error: 'Failed to create task', detail: errorMessage },
      { status: 500 }
    );
  }
}

