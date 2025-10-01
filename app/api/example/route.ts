import { NextRequest, NextResponse } from 'next/server';
import { externalApiClient } from '@/lib/api/client';
import { handleApiError, ApiError } from '@/lib/api/error-handler';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    const data = await externalApiClient.get(`/endpoint${id ? `/${id}` : ''}`);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body) {
      throw new ApiError(400, 'Request body is required');
    }

    const data = await externalApiClient.post('/endpoint', body);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError(400, 'ID parameter is required');
    }

    const data = await externalApiClient.put(`/endpoint/${id}`, body);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      throw new ApiError(400, 'ID parameter is required');
    }

    const data = await externalApiClient.delete(`/endpoint/${id}`);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
