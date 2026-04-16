import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { cep, originZip, token, items, defaultDimensions } = body;

        const finalToken = token || process.env.SUPER_FRETE_API;
        const finalOriginZip = originZip || process.env.NEXT_PUBLIC_ORIGIN_CEP || '01310200';

        if (!cep || !finalOriginZip || !finalToken) {
            throw new Error('Parâmetros obrigatórios ausentes (cep, originZip ou token)');
        }

        // 1. Calcular Peso e Dimensões Totais (Lógica Simplificada de Cubagem/Soma)
        // Em um cenário real, você teria uma lógica complexa de empacotamento.
        // Aqui, somamos os pesos e pegamos a maior dimensão para simular uma caixa única.
        let totalWeight = 0;
        let maxHeight = 0;
        let maxWidth = 0;
        let maxLength = 0;

        if (items && items.length > 0) {
            items.forEach(item => {
                totalWeight += (Number(item.weight) || Number(defaultDimensions.weight)) * item.quantity;
                maxHeight = Math.max(maxHeight, Number(item.height) || Number(defaultDimensions.height));
                maxWidth = Math.max(maxWidth, Number(item.width) || Number(defaultDimensions.width));
                maxLength = Math.max(maxLength, Number(item.length) || Number(defaultDimensions.length));
            });
        } else {
            totalWeight = Number(defaultDimensions.weight);
            maxHeight = Number(defaultDimensions.height);
            maxWidth = Number(defaultDimensions.width);
            maxLength = Number(defaultDimensions.length);
        }

        // Garantir valores mínimos exigidos por transportadoras (ex: Correios/Jadlog)
        const finalWeight = Math.max(totalWeight, 0.3);
        const finalHeight = Math.max(maxHeight, 2);
        const finalWidth = Math.max(maxWidth, 11);
        const finalLength = Math.max(maxLength, 16);

        // 2. Chamada para a API da SuperFrete
        const superFreteUrl = 'https://api.superfrete.com/api/v0/calculator';
        
        const payload = {
            from: {
                postal_code: finalOriginZip.replace(/\D/g, '')
            },
            to: {
                postal_code: cep.replace(/\D/g, '')
            },
            package: {
                weight: finalWeight.toFixed(2),
                height: Math.ceil(finalHeight).toString(),
                width: Math.ceil(finalWidth).toString(),
                length: Math.ceil(finalLength).toString()
            }
        };

        console.log('Enviando para SuperFrete:', JSON.stringify(payload, null, 2));

        const response = await fetch(superFreteUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${finalToken}`,
                'Content-Type': 'application/json',
                'User-Agent': 'InoveDev/1.0.0 (integracao@inove-dev.com)',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Erro API SuperFrete: ${response.status} - ${errorMsg}`);
        }

        const data = await response.json();

        // 3. Filtrar Jadlog e Loggi (ou retornar as melhores opções)
        // Nota: O formato exato do retorno depende da versão da API. 
        // Geralmente é uma lista de objetos com 'name', 'price', 'delivery_time'.
        const filteredOptions = data.filter(opt => 
            opt.name.toLowerCase().includes('jadlog') || 
            opt.name.toLowerCase().includes('loggi')
        );

        // Se não houver Jadlog/Loggi, retorna as 2 primeiras opções disponíveis
        const finalOptions = filteredOptions.length > 0 ? filteredOptions : data.slice(0, 2);

        return NextResponse.json({
            options: finalOptions.map(opt => ({
                name: opt.name,
                price: opt.price.toString().replace('.', ','),
                delivery_time: opt.delivery_time,
                id: opt.id || opt.name
            }))
        });

    } catch (error) {
        console.error('Erro no cálculo de frete SuperFrete:', error);

        // 4. FALLBACK ROBUSTO (Nunca dar erro ao cliente)
        const mockOptions = [
            { name: 'Jadlog Package (Simulado)', price: '28,90', delivery_time: 5, id: 'fb1' },
            { name: 'Loggi Express (Simulado)', price: '34,50', delivery_time: 3, id: 'fb2' }
        ];

        return NextResponse.json({
            options: mockOptions,
            isFallback: true,
            errorMsg: error.message
        });
    }
}
