'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addAddress } from "@/lib/features/address/addressSlice"
import { dbAdapter } from "@/dbAdapter"

const AddressModal = ({ setShowAddressModal }) => {

    const dispatch = useDispatch()

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        zip: '',
        country: 'Brasil',
        phone: ''
    })

    const handleAddressChange = async (e) => {
        const { name, value } = e.target;
        
        setAddress(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'zip' && value.replace(/\D/g, '').length === 8) {
            try {
                const cep = value.replace(/\D/g, '');
                const response = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
                if (response.ok) {
                    const data = await response.json();
                    setAddress(prev => ({
                        ...prev,
                        street: data.street || prev.street,
                        neighborhood: data.neighborhood || prev.neighborhood,
                        city: data.city || prev.city,
                        state: data.state || prev.state,
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Persiste no banco simulado (localStorage) e obtém o endereço com ID
        const saved = await dbAdapter.createAddress(address)

        // Adiciona ao estado Redux para ficar disponível no select imediatamente
        dispatch(addAddress(saved))

        toast.success('Endereço salvo com sucesso!')
        setShowAddressModal(false)
    }

    return (
        <form onSubmit={handleSubmit} className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center">
            <div className="flex flex-col gap-4 text-slate-700 w-full max-w-sm mx-6 bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
                <h2 className="text-2xl">Adicionar <span className="font-semibold">Endereço</span></h2>

                <div className="flex flex-col gap-3">
                    <input
                        name="name"
                        onChange={handleAddressChange}
                        value={address.name}
                        className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                        type="text"
                        placeholder="Nome completo do destinatário"
                        required
                    />
                    <input
                        name="email"
                        onChange={handleAddressChange}
                        value={address.email}
                        className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                        type="email"
                        placeholder="E-mail para confirmação"
                        required
                    />
                    <input
                        name="phone"
                        onChange={handleAddressChange}
                        value={address.phone}
                        className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                        type="text"
                        placeholder="Telefone / WhatsApp"
                        required
                    />
                    <div className="flex gap-3">
                        <input
                            name="zip"
                            onChange={handleAddressChange}
                            value={address.zip}
                            className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                            type="text"
                            placeholder="CEP (somente números)"
                            maxLength={8}
                            required
                        />
                        <input
                            name="country"
                            onChange={handleAddressChange}
                            value={address.country}
                            className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                            type="text"
                            placeholder="País"
                            required
                        />
                    </div>
                    <input
                        name="street"
                        onChange={handleAddressChange}
                        value={address.street}
                        className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                        type="text"
                        placeholder="Rua, número e complemento"
                        required
                    />
                     <input
                        name="neighborhood"
                        onChange={handleAddressChange}
                        value={address.neighborhood}
                        className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                        type="text"
                        placeholder="Bairro"
                        required
                    />
                    <div className="flex gap-3">
                        <input
                            name="city"
                            onChange={handleAddressChange}
                            value={address.city}
                            className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full focus:border-green-500 transition text-sm"
                            type="text"
                            placeholder="Cidade"
                            required
                        />
                        <input
                            name="state"
                            onChange={handleAddressChange}
                            value={address.state}
                            className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-2/5 focus:border-green-500 transition text-sm uppercase"
                            type="text"
                            placeholder="UF"
                            maxLength={2}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-slate-800 text-white text-sm font-medium py-3 rounded-lg hover:bg-slate-900 active:scale-95 transition-all mt-1"
                >
                    SALVAR ENDEREÇO
                </button>
            </div>
            <XIcon
                size={28}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer transition"
                onClick={() => setShowAddressModal(false)}
            />
        </form>
    )
}

export default AddressModal