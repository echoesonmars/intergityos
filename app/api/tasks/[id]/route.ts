import { NextResponse } from 'next/server';
import { tasksApi, authApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/tasks/[id] - Get task by ID
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const task = await tasksApi.getById(token, params.id);
    return NextResponse.json(task);
  } catch (error: unknown) {
    console.error(`Error fetching task ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : `Failed to fetch task ${params.id}`;
    return NextResponse.json(
      { error: `Failed to fetch task ${params.id}`, detail: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tasks/[id] - Update task
 */
export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    const updatedTask = await tasksApi.update(token, params.id, body);

    return NextResponse.json(updatedTask);
  } catch (error: unknown) {
    console.error(`Error updating task ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : `Failed to update task ${params.id}`;
    return NextResponse.json(
      { error: `Failed to update task ${params.id}`, detail: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tasks/[id] - Delete task
 */
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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

    await tasksApi.delete(token, params.id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error(`Error deleting task ${params.id}:`, error);
    const errorMessage = error instanceof Error ? error.message : `Failed to delete task ${params.id}`;
    return NextResponse.json(
      { error: `Failed to delete task ${params.id}`, detail: errorMessage },
      { status: 500 }
    );
  }
}

