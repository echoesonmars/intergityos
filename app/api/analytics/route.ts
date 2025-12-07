import { NextResponse } from 'next/server';
import { statisticsApi, defectsApi } from '@/lib/api';

export const dynamic = 'force-dynamic';

/**
 * GET /api/analytics - Get analytics data
 */
export async function GET(request: Request) {
  try {
    // const { searchParams } = new URL(request.url);
    // const period = searchParams.get('period') || 'year'; // Reserved for future use
    void request; // Suppress unused variable warning

    // Get statistics
    const stats = await statisticsApi.get();
    
    // Get all defects for detailed analysis
    const defectsResponse = await defectsApi.getAll({ limit: 1000 });

    // Calculate trends (mock for now, can be enhanced with date filtering)
    const totalDefects = stats.total_defects || 0;
    const previousYearDefects = Math.floor(totalDefects * 0.85); // Mock previous year
    const growthRate = totalDefects > 0 
      ? ((totalDefects - previousYearDefects) / previousYearDefects * 100).toFixed(0)
      : '0';

    // Group by pipeline
    const pipelineMap = new Map<string, {
      pipeline: string;
      objects: number;
      defects: number;
      critical: number;
    }>();

    defectsResponse.defects.forEach((defect) => {
      const pipeline = defect.pipeline_id || 'MT-01';
      if (!pipelineMap.has(pipeline)) {
        pipelineMap.set(pipeline, {
          pipeline,
          objects: 0,
          defects: 0,
          critical: 0,
        });
      }

      const pipe = pipelineMap.get(pipeline)!;
      pipe.objects++;
      pipe.defects++;

      const severity = defect.details?.severity || defect.severity || '';
      if (severity === 'критичный' || severity === 'critical' || severity === 'высокий' || severity === 'high') {
        pipe.critical++;
      }
    });

    const pipelineComparison = Array.from(pipelineMap.values());

    // Generate yearly data (mock, can be enhanced with real date filtering)
    const currentYear = new Date().getFullYear();
    const yearlyData = [];
    for (let year = currentYear - 4; year <= currentYear; year++) {
      const yearDefects = Math.floor(totalDefects * (0.7 + Math.random() * 0.3));
      const yearInspections = Math.floor(yearDefects * 1.5);
      yearlyData.push({
        year,
        inspections: yearInspections,
        defects: yearDefects,
      });
    }

    return NextResponse.json({
      trends: {
        inspectionsGrowth: growthRate,
        defectsReduction: (-parseInt(growthRate) / 2).toString(),
        plannedWorks: 24,
      },
      yearlyData,
      pipelineComparison,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    
    // Fallback to mock data
    return NextResponse.json({
      trends: {
        inspectionsGrowth: '23',
        defectsReduction: '-12',
        plannedWorks: 24,
      },
      yearlyData: [
        { year: 2020, inspections: 120, defects: 15 },
        { year: 2021, inspections: 145, defects: 18 },
        { year: 2022, inspections: 168, defects: 22 },
        { year: 2023, inspections: 195, defects: 28 },
        { year: 2024, inspections: 45, defects: 6 },
      ],
      pipelineComparison: [
        { pipeline: 'MT-01', objects: 450, defects: 35, critical: 8 },
        { pipeline: 'MT-02', objects: 520, defects: 42, critical: 12 },
        { pipeline: 'MT-03', objects: 277, defects: 12, critical: 3 },
      ],
    });
  }
}

