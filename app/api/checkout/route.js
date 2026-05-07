import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            items,
            payer,
            shippingCost = 0,
            orderId,
            accessToken,
            sandbox = true,
            discountAmount = 0,
        } = body;

        if (!accessToken) {
            return NextResponse.json(
                { error: 'Access Token do Mercado Pago não configurado.' },
                { status: 400 }
            );
        }

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'Nenhum item no carrinho.' },
                { status: 400 }
            );
        }

        // Inicializa o SDK do Mercado Pago com o token do lojista
        const client = new MercadoPagoConfig({ accessToken });
        const preference = new Preference(client);

        // Monta os itens para a preferência
        const mpItems = items.map(item => ({
            id: item.id || String(Date.now()),
            title: item.name || item.title || 'Produto',
            description: item.category || '',
            quantity: Number(item.quantity) || 1,
            unit_price: Number(item.price) || 0,
            currency_id: 'BRL',
        }));

        // Adiciona frete como item separado (se existir)
        if (shippingCost > 0) {
            mpItems.push({
                id: 'shipping',
                title: 'Frete',
                description: 'Custo de envio',
                quantity: 1,
                unit_price: Number(shippingCost),
                currency_id: 'BRL',
            });
        }

        // Adiciona desconto como item negativo (se existir)
        if (discountAmount > 0) {
            mpItems.push({
                id: 'discount',
                title: 'Desconto (Cupom)',
                description: 'Desconto aplicado',
                quantity: 1,
                unit_price: -Number(discountAmount),
                currency_id: 'BRL',
            });
        }

        // Monta a URL base a partir do request
        const origin = request.headers.get('origin') || request.headers.get('referer')?.replace(/\/+$/, '') || 'http://localhost:3000';

        // Cria a preferência de pagamento
        const response = await preference.create({
            body: {
                items: mpItems,
                payer: {
                    name: payer?.name || '',
                    email: payer?.email || '',
                },
                back_urls: {
                    success: `${origin}/checkout/success`,
                    failure: `${origin}/checkout/success`,
                    pending: `${origin}/checkout/success`,
                },
                auto_return: 'approved',
                external_reference: orderId || '',
                statement_descriptor: 'INOVE-DEV',
            },
        });

        return NextResponse.json({
            id: response.id,
            init_point: sandbox ? response.sandbox_init_point : response.init_point,
        });
    } catch (error) {
        console.error('Erro ao criar preferência do Mercado Pago:', error);

        const errorMessage = error?.message || error?.cause?.message || 'Erro desconhecido ao processar pagamento.';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
