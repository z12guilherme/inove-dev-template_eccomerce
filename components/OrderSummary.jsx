import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react'
import AddressModal from './AddressModal';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
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
    const [coupon, setCoupon] = useState('');

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
                setCoupon(validCoupon);
                toast.success('Cupom aplicado com sucesso!', { id: toastId });
            } else {
                toast.error('Cupom inválido ou expirado.', { id: toastId });
            }
        } catch (error) {
            toast.error('Erro ao verificar cupom.', { id: toastId });
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

        const toastId = toast.loading('Processando Pagamento...');

        // Simulando tempo de resposta de um Gateway de Pagamento
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Montando o objeto do pedido com dados reais do endereço
        const orderData = {
            total: finalTotal,
            status: "confirmed",
            customerName: selectedAddress.name,
            customerEmail: selectedAddress.email,
            paymentMethod: paymentMethod,
            isCouponUsed: !!coupon,
            couponCode: coupon?.code || null,
            discountAmount: discountAmount,
            shippingCost: shippingCost,
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
            // 1. Salva o pedido no banco de dados simulado
            const savedOrder = await dbAdapter.createOrder(orderData);

            // 2. Guarda o ID do pedido para exibir na tela de sucesso
            sessionStorage.setItem('last_order_id', savedOrder.id);
            sessionStorage.setItem('last_order_customer', selectedAddress.name);

            // 3. Limpa o carrinho (removendo cada item comprado)
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

    const discountAmount = coupon ? ((coupon.discount || coupon.discount_percentage || 0) / 100 * totalPrice) : 0;
    const finalTotal = totalPrice + shippingCost - discountAmount;

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Resumo do Pedido</h2>
            <p className='text-slate-400 text-xs my-4'>Método de Pagamento</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="PIX" onChange={() => setPaymentMethod('PIX')} checked={paymentMethod === 'PIX'} className='accent-green-500' />
                <label htmlFor="PIX" className='cursor-pointer font-medium text-slate-700'>PIX (Aprovação Imediata)</label>
            </div>
            <div className='flex gap-2 items-center mt-2'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-green-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Cartão de Crédito</label>
            </div>
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
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right text-lg text-slate-800'>{currency}{finalTotal.toFixed(2)}</p>
            </div>
            <button onClick={handlePlaceOrder} className='w-full bg-green-500 text-white py-3 mt-2 rounded-lg font-medium hover:bg-green-600 active:scale-95 transition-all'>Finalizar Pedido</button>

            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}

        </div>
    )
}

export default OrderSummary