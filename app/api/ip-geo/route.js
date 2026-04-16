import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET(request) {
    const headersList = headers();
    // Pega o IP do header 'x-forwarded-for' (padrão em Vercel/proxies) ou usa um fallback
    const ip = (headersList.get('x-forwarded-for') || '127.0.0.1').split(',')[0].trim();

    // Se o IP for de loopback (desenvolvimento local), usa um IP de teste para demonstração
    const targetIp = (ip === '127.0.0.1' || ip === '::1') ? '179.127.37.74' : ip;

    const apiKey = process.env.ABSTRACT_API_KEY;

    if (!apiKey) {
        console.error('Chave da API de geolocalização (ABSTRACT_API_KEY) não está configurada no .env.local');
        // Retorna uma resposta de fallback para não quebrar o front-end
        return NextResponse.json({
            city: 'Não disponível',
            region: 'Não disponível',
            country: 'Não disponível',
            is_vpn: false
        }, { status: 500 });
    }

    try {
        const url = `https://ip-intelligence.abstractapi.com/v1/?api_key=${apiKey}&ip_address=${targetIp}`;
        const apiResponse = await fetch(url);

        if (!apiResponse.ok) {
            throw new Error(`API de IP respondeu com status: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();

        // Retorna apenas os campos necessários para o front-end
        return NextResponse.json({
            city: data.city,
            region: data.region,
            country: data.country,
            is_vpn: data.security?.is_vpn || false,
        });

    } catch (error) {
        console.error('Erro ao buscar dados de geolocalização do IP:', error);
        // Retorna uma resposta de fallback em caso de erro na API externa
        return NextResponse.json({ city: 'N/A', region: 'N/A', country: 'N/A', is_vpn: false }, { status: 500 });
    }
}