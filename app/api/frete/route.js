import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const { 
            cep, 
            originZip, 
            token, 
            items, 
            defaultDimensions,
            sandbox = true,
            services = '1,2,17,3,31',
            userAgent = 'InoveDev/1.0.0 (contato@inove-dev.com)'
        } = body;

        const finalToken = token || process.env.SUPER_FRETE_API;
        const finalOriginZip = originZip || process.env.NEXT_PUBLIC_ORIGIN_CEP || '01310200';

        if (!cep || !finalOriginZip || !finalToken) {
            throw new Error('Parâmetros obrigatórios ausentes (cep, originZip ou token)');
        }

        const superFreteUrl = sandbox 
            ? 'https://sandbox.superfrete.com/api/v0/calculator' 
            : 'https://api.superfrete.com/api/v0/calculator';
        
        const payload = {
            from: {
                postal_code: finalOriginZip.replace(/\D/g, '')
            },
            to: {
                postal_code: cep.replace(/\D/g, '')
            },
            services: services,
            options: {
                own_hand: false,
                receipt: false,
                insurance_value: 0,
                use_insurance_value: false
            }
        };

        // Se houver itens, enviamos o array de produtos para que a SuperFrete calcule a caixa ideal
        if (items && items.length > 0) {
            payload.products = items.map(item => ({
                quantity: item.quantity || 1,
                weight: Number(item.weight) || Number(defaultDimensions.weight) || 0.3,
                height: Number(item.height) || Number(defaultDimensions.height) || 2,
                width: Number(item.width) || Number(defaultDimensions.width) || 11,
                length: Number(item.length) || Number(defaultDimensions.length) || 16
            }));
        } else {
            // Caso contrário, enviamos uma caixa com as dimensões padrão
            payload.package = {
                weight: (Number(defaultDimensions.weight) || 0.3).toFixed(2),
                height: Math.ceil(Number(defaultDimensions.height) || 2).toString(),
                width: Math.ceil(Number(defaultDimensions.width) || 11).toString(),
                length: Math.ceil(Number(defaultDimensions.length) || 16).toString()
            };
        }

        console.log(`Enviando para SuperFrete (${sandbox ? 'SANDBOX' : 'PROD'}):`, JSON.stringify(payload, null, 2));

        const response = await fetch(superFreteUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${finalToken}`,
                'Content-Type': 'application/json',
                'User-Agent': userAgent,
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(`Erro API SuperFrete: ${response.status} - ${errorMsg}`);
        }

        const data = await response.json();

        // Verificar se retornou erro no corpo (algumas APIs retornam 200 com erro no JSON)
        if (data.message && !Array.isArray(data)) {
            throw new Error(data.message);
        }

        // 3. Formatar resposta
        // A API retorna um array de serviços
        return NextResponse.json({
            options: data.map(opt => ({
                name: opt.name,
                price: opt.price.toString().replace('.', ','),
                delivery_time: opt.delivery_time,
                id: opt.id || opt.name,
                error: opt.error // Caso algum serviço específico tenha dado erro
            })).filter(opt => !opt.error) // Remove opções que deram erro na transportadora
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
