import { NextRequest, NextResponse } from 'next/server';
/**
 * API Route pour la génération IA avec streaming
 */
export declare function POST(request: NextRequest): Promise<Response>;
/**
 * Support pour les requêtes GET (vérification de santé)
 */
export declare function GET(): Promise<NextResponse<{
    status: string;
    ai: boolean;
    timestamp: string;
}> | NextResponse<{
    status: string;
    error: string;
}>>;
