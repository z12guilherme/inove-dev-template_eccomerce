import { PlusIcon, SquarePenIcon, XIcon, CreditCardIcon, ShieldCheckIcon, Loader2Icon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { deleteItemFromCart, setCoupon, removeCoupon } from "@/lib/features/cart/cartSlice";
import { dbAdapter } from "../dbAdapter";

const OrderSummary = ({ totalPrice, shippingCost = 0, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$';

    const router = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const coupon = useSelector(state => state.cart.appliedCoupon);

    // Estado do Mercado Pago
    const [mpEnabled, setMpEnabled] = useState(false);
    const [mpSettings, setMpSettings] = useState(null);
    const [processingMP, setProcessingMP] = useState(false);

    // Carrega as configurações de pagamento da loja
    useEffect(() => {
        const loadPaymentSettings = async () => {
            try {
                const settings = await dbAdapter.getStoreSettings();
                if (settings?.mercadoPagoEnabled && settings?.mercadoPagoAccessToken?.trim()) {
                    setMpEnabled(true);
                    setMpSettings(settings);
                    setPaymentMethod('MERCADO_PAGO'); // Default para MP quando ativo
                }
            } catch (e) {
                console.error('Erro ao carregar configurações de pagamento:', e);
            }
        };
        loadPaymentSettings();
    }, []);

    const handleCouponCode = async (event) => {
        event.preventDefault();

        if (!couponCodeInput.trim()) {
            toast.error('Por favor, insira o código do cupom.');
            return;
        }

        const toastId = toast.loading('Verificando Cupom...');

        try {
            await new Promise(resolve => setTimeout(resolve, 800)); // Simula requisição rápida
            const validCoupon = await dbAdapter.getCouponByCode(couponCodeInput);

            if (validCoupon) {
                dispatch(setCoupon(validCoupon));
                toast.success('Cupom aplicado com sucesso!', { id: toastId });
            } else {
                toast.error('Cupom inválido ou expirado.', { id: toastId });
            }
        } catch (error) {
            toast.error('Erro ao verificar cupom.', { id: toastId });
        }
    }

    // ── Fluxo de pagamento via Mercado Pago ──────────────────────────────────
    const handleMercadoPagoCheckout = async () => {
        setProcessingMP(true);
        const toastId = toast.loading('Criando pagamento no Mercado Pago...');

        try {
            // 1. Buscar IP (opcional, para rastreamento)
            let ipData = null;
            try {
                const ipResponse = await fetch('/api/ip-geo');
                if (ipResponse.ok) ipData = await ipResponse.json();
            } catch { /* ignora */ }

            // 2. Salvar pedido no banco como "pending_payment"
            const orderData = {
                total: finalTotal,
                status: "pending_payment",
                customer_name: selectedAddress.name,
                customer_email: selectedAddress.email,
                paymentMethod: 'MERCADO_PAGO',
                isCouponUsed: !!coupon,
                couponCode: coupon?.code || null,
                discountAmount: discountAmount,
                shippingCost: shippingCost,
                order_location_city: ipData?.city || null,
                order_location_region: ipData?.region || null,
                order_location_country: ipData?.country || null,
                order_location_is_vpn: ipData?.is_vpn || false,
                orderItems: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    variantKey: item.variantKey || null,
                    product: { id: item.id, name: item.name, category: item.category, image: item.images?.[0] || null }
                })),
                address: selectedAddress
            };

            const savedOrder = await dbAdapter.createOrder(orderData);

            // 3. Chamar API Route para criar preferência no Mercado Pago
            const checkoutResponse = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        title: item.name,
                        category: item.category,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                    payer: {
                        name: selectedAddress.name,
                        email: selectedAddress.email || '',
                    },
                    shippingCost,
                    discountAmount,
                    orderId: savedOrder.id,
                    accessToken: mpSettings.mercadoPagoAccessToken,
                    sandbox: mpSettings.mercadoPagoSandbox,
                }),
            });

            const data = await checkoutResponse.json();

            if (!checkoutResponse.ok || !data.init_point) {
                throw new Error(data.error || 'Erro ao criar pagamento.');
            }

            // 4. Guardar dados para a tela de sucesso
            sessionStorage.setItem('last_order_id', savedOrder.id);
            sessionStorage.setItem('last_order_customer', selectedAddress.name);

            // 5. Limpar carrinho
            items.forEach(item => {
                dispatch(deleteItemFromCart({ productId: item.id }));
            });

            toast.dismiss(toastId);
            toast.success('Redirecionando para o Mercado Pago...');

            // 6. Redirecionar para o Mercado Pago
            window.location.href = data.init_point;

        } catch (error) {
            toast.dismiss(toastId);
            toast.error(error.message || 'Erro ao processar pagamento.');
            console.error('Erro Mercado Pago:', error);
            setProcessingMP(false);
        }
    }

    // ── Fluxo de pagamento simulado (original) ──────────────────────────────
    const handleSimulatedCheckout = async () => {
        const toastId = toast.loading('Processando Pagamento...');

        // 1. Buscar dados de geolocalização do IP a partir da nossa API interna
        let ipData = null;
        try {
            const ipResponse = await fetch('/api/ip-geo');
            if (ipResponse.ok) {
                ipData = await ipResponse.json();
            }
        } catch (error) {
            console.error("Erro ao buscar dados de geolocalização do IP:", error);
        }

        // Simulando tempo de resposta de um Gateway de Pagamento
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Montando o objeto do pedido com dados reais do endereço
        const orderData = {
            total: finalTotal,
            status: "confirmed",
            customer_name: selectedAddress.name,
            customer_email: selectedAddress.email,
            paymentMethod: paymentMethod,
            isCouponUsed: !!coupon,
            couponCode: coupon?.code || null,
            discountAmount: discountAmount,
            shippingCost: shippingCost,
            order_location_city: ipData?.city || null,
            order_location_region: ipData?.region || null,
            order_location_country: ipData?.country || null,
            order_location_is_vpn: ipData?.is_vpn || false,
            orderItems: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
                variantKey: item.variantKey || null,
                product: { id: item.id, name: item.name, category: item.category, image: item.images?.[0] || null }
            })),
            address: selectedAddress
        };

        try {
            const savedOrder = await dbAdapter.createOrder(orderData);

            sessionStorage.setItem('last_order_id', savedOrder.id);
            sessionStorage.setItem('last_order_customer', selectedAddress.name);

            items.forEach(item => {
                dispatch(deleteItemFromCart({ productId: item.id }));
            });

            toast.dismiss(toastId);
            toast.success('Pagamento aprovado e pedido salvo!');
            router.push('/checkout/success');
        } catch (error) {
            toast.dismiss(toastId);
            toast.error('Erro ao processar o pedido.');
            console.error(error);
        }
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (shippingCost === 0) {
            toast.error('Por favor, calcule o frete antes de finalizar o pedido.');
            return;
        }

        if (!selectedAddress) {
            toast.error('Por favor, selecione um endereço de entrega.');
            return;
        }

        // Decide qual fluxo usar
        if (paymentMethod === 'MERCADO_PAGO' && mpEnabled) {
            await handleMercadoPagoCheckout();
        } else {
            await handleSimulatedCheckout();
        }
    }

    const discountAmount = coupon ? ((coupon.discount || coupon.discount_percentage || 0) / 100 * totalPrice) : 0;
    const finalTotal = totalPrice + shippingCost - discountAmount;

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Resumo do Pedido</h2>
            <p className='text-slate-400 text-xs my-4'>Método de Pagamento</p>

            {/* ── Opções de pagamento ── */}
            {mpEnabled ? (
                <>
                    {/* Mercado Pago ativo — opção principal */}
                    <div
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'MERCADO_PAGO'
                            ? 'border-[#009ee3] bg-[#009ee3]/5 ring-1 ring-[#009ee3]/30'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setPaymentMethod('MERCADO_PAGO')}
                    >
                        <input
                            type="radio"
                            id="MERCADO_PAGO"
                            name="payment"
                            checked={paymentMethod === 'MERCADO_PAGO'}
                            onChange={() => setPaymentMethod('MERCADO_PAGO')}
                            className='accent-[#009ee3]'
                        />
                        <div className="flex-1">
                            <label htmlFor="MERCADO_PAGO" className='cursor-pointer font-medium text-slate-700 flex items-center gap-2'>
                                <CreditCardIcon size={16} className="text-[#009ee3]" />
                                Mercado Pago
                            </label>
                            <p className="text-[10px] text-slate-400 mt-0.5 ml-6">PIX · Cartão de Crédito · Boleto</p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            <ShieldCheckIcon size={10} /> Seguro
                        </div>
                    </div>

                    {/* Opção simulada (fallback) */}
                    <div
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all mt-2 ${paymentMethod !== 'MERCADO_PAGO'
                            ? 'border-slate-400 bg-slate-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setPaymentMethod('PIX')}
                    >
                        <input
                            type="radio"
                            id="OFFLINE"
                            name="payment"
                            checked={paymentMethod !== 'MERCADO_PAGO'}
                            onChange={() => setPaymentMethod('PIX')}
                            className='accent-green-500'
                        />
                        <label htmlFor="OFFLINE" className='cursor-pointer text-slate-500'>Pagamento na entrega / Combinar</label>
                    </div>
                </>
            ) : (
                <>
                    {/* Mercado Pago desativado — opções simuladas originais */}
                    <div className='flex gap-2 items-center'>
                        <input type="radio" id="PIX" onChange={() => setPaymentMethod('PIX')} checked={paymentMethod === 'PIX'} className='accent-green-500' />
                        <label htmlFor="PIX" className='cursor-pointer font-medium text-slate-700'>PIX (Aprovação Imediata)</label>
                    </div>
                    <div className='flex gap-2 items-center mt-2'>
                        <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-green-500' />
                        <label htmlFor="STRIPE" className='cursor-pointer'>Cartão de Crédito</label>
                    </div>
                </>
            )}

            {/* ── Endereço ── */}
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Endereço</p>
                {
                    selectedAddress ? (
                        <div className='flex gap-2 items-center'>
                            <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                            <SquarePenIcon onClick={() => setSelectedAddress(null)} className='cursor-pointer' size={18} />
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Selecione o Endereço</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => setShowAddressModal(true)} >Adicionar Endereço <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>

            {/* ── Resumo de valores ── */}
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Frete:</p>
                        {coupon && <p>Cupom:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toFixed(2)}</p>
                        <p>{shippingCost > 0 ? `${currency}${shippingCost.toFixed(2)}` : 'A calcular'}</p>
                        {coupon && <p className="text-green-500">{`-${currency}${discountAmount.toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={handleCouponCode} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Código do Cupom' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Aplicar</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Código: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => dispatch(removeCoupon())} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>

            {/* ── Total ── */}
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right text-lg text-slate-800'>{currency}{finalTotal.toFixed(2)}</p>
            </div>

            {/* ── Botão de finalizar ── */}
            <button
                onClick={handlePlaceOrder}
                disabled={processingMP}
                className={`w-full text-white py-3 mt-2 rounded-lg font-medium active:scale-95 transition-all flex items-center justify-center gap-2 ${
                    processingMP
                        ? 'bg-slate-400 cursor-not-allowed'
                        : paymentMethod === 'MERCADO_PAGO'
                            ? 'bg-[#009ee3] hover:bg-[#0086c9]'
                            : 'bg-green-500 hover:bg-green-600'
                }`}
            >
                {processingMP ? (
                    <>
                        <Loader2Icon size={18} className="animate-spin" />
                        Processando...
                    </>
                ) : paymentMethod === 'MERCADO_PAGO' ? (
                    <>
                        <CreditCardIcon size={18} />
                        Pagar com Mercado Pago
                    </>
                ) : (
                    'Finalizar Pedido'
                )}
            </button>

            {/* Badge de segurança quando MP ativo */}
            {paymentMethod === 'MERCADO_PAGO' && (
                <p className="text-[10px] text-slate-400 text-center mt-2 flex items-center justify-center gap-1">
                    <ShieldCheckIcon size={10} /> Você será redirecionado para o ambiente seguro do Mercado Pago
                </p>
            )}

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary