import { NextResponse } from 'next/server';
import { EnterpriseSDK } from '@skygenesisenterprise/enterprise-node';
// Configuration du SDK pour le serveur
let sdkInstance = null;
async function getSDK() {
    if (!sdkInstance) {
        sdkInstance = new EnterpriseSDK({
            // Configuration serveur par défaut
            debug: process.env.NODE_ENV === 'development',
            // Autres configurations serveur
        });
        await sdkInstance.initialize();
    }
    return sdkInstance;
}
/**
 * API Route pour la génération IA avec streaming
 */
export async function POST(request) {
    try {
        const { prompt, options = {} } = await request.json();
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }
        const sdk = await getSDK();
        // Vérifier si le module AI est disponible
        if (!sdk.ai) {
            return NextResponse.json({ error: 'AI module not available' }, { status: 503 });
        }
        // Créer une réponse streaming
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Simuler le streaming (adapter selon votre implémentation AI)
                    const result = await sdk.ai.generate(prompt, {
                        ...options,
                        stream: true,
                        onChunk: (chunk) => {
                            controller.enqueue(encoder.encode(chunk));
                        },
                    });
                    // Si le streaming n'est pas supporté, envoyer le résultat complet
                    if (result) {
                        controller.enqueue(encoder.encode(result));
                    }
                }
                catch (error) {
                    controller.error(error);
                }
                finally {
                    controller.close();
                }
            },
        });
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        });
    }
    catch (error) {
        console.error('AI Generation API Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
/**
 * Support pour les requêtes GET (vérification de santé)
 */
export async function GET() {
    try {
        const sdk = await getSDK();
        const isAIAvailable = !!sdk.ai;
        return NextResponse.json({
            status: 'healthy',
            ai: isAIAvailable,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        return NextResponse.json({ status: 'unhealthy', error: 'SDK initialization failed' }, { status: 503 });
    }
}
//# sourceMappingURL=ai-generate.js.map