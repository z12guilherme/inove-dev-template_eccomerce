// Exemplo de como seria o arquivo: app/api/frete/route.js
import { calcularPrecoPrazo } from 'correios-brasil';
import { NextResponse } from 'next/server';

export async function GET(request) { // Certifique-se de que não há "default" aqui!
    const { searchParams } = new URL(request.url);
    const cepDestino = searchParams.get('cep');

    if (!cepDestino) {
        return NextResponse.json({ error: 'CEP de destino não informado' }, { status: 400 });
    }

    try {
        const args = {
            sCepOrigem: '01310200', // CEP da sua loja (Ex: Av Paulista)
            sCepDestino: cepDestino,
            nVlPeso: '1', // Peso em KG
            nCdFormato: '1', // 1 para caixa / pacote
            nVlComprimento: '20',
            nVlAltura: '20',
            nVlLargura: '20',
            nCdServico: ['04014'], // 04014 = SEDEX, 04510 = PAC
            nVlDiametro: '0',
        };

        const result = await calcularPrecoPrazo(args);
        
        // Retorna o valor e o prazo formatados para o Frontend
        return NextResponse.json({
            valor: result[0].Valor,
            prazo: result[0].PrazoEntrega
        });

    } catch (error) {
        console.error('Erro detalhado da API dos Correios:', error);
        
        // Fallback movido para o Backend: garante que a API nunca falhe!
        let valorSimulado = '35,00';
        if (cepDestino.startsWith('7')) valorSimulado = '15,50';
        else if (cepDestino.startsWith('2')) valorSimulado = '25,80';

        return NextResponse.json({ 
            valor: valorSimulado, 
            prazo: '5', 
            isFallback: true 
        });
    }
}
