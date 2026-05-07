'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { getAppearance, defaultAppearance } from '@/lib/appearanceStore'

// Renderiza imagem que pode ser URL externa, base64 ou asset local
function DynamicImage({ src, fallback, alt, className, priority }) {
    if (src) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={src}
                alt={alt}
                className={className}
                style={{ objectFit: 'cover' }}
            />
        )
    }
    return (
        <Image
            className={className}
            src={fallback}
            alt={alt}
            priority={priority}
        />
    )
}

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$'
    const [content, setContent] = useState(defaultAppearance)

    useEffect(() => {
        setContent(getAppearance())

        const handleStorage = () => setContent(getAppearance())
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>

                {/* Card principal do Hero */}
                <div className='relative flex-1 flex flex-col bg-brand-light rounded-3xl xl:min-h-100 group'>
                    <div className='p-5 sm:p-16'>

                        {/* Badge de novidade */}
                        <div className='inline-flex items-center gap-3 bg-brand-mid text-brand-dark pr-4 p-1 rounded-full text-xs sm:text-sm'>
                            <span className='bg-brand px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs'>
                                {content.heroBadgeLabel}
                            </span>
                            {content.heroBadgeText}
                            <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>

                        {/* Headline */}
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium bg-gradient-to-r from-slate-600 to-brand bg-clip-text text-transparent max-w-xs sm:max-w-md'>
                            {content.heroHeadline}
                        </h2>

                        {/* Preço de entrada */}
                        <div className='text-slate-800 text-sm font-medium mt-4 sm:mt-8'>
                            <p>A partir de</p>
                            <p className='text-3xl'>{currency}{content.heroStartingPrice}</p>
                        </div>

                        {/* CTA */}
                        <button className='bg-accent text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:opacity-90 hover:scale-103 active:scale-95 transition'>
                            {content.heroButtonText}
                        </button>
                    </div>

                    <DynamicImage
                        src={content.heroImage}
                        fallback={assets.hero_model_img}
                        alt="Hero"
                        className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm'
                        priority
                    />
                </div>

                {/* Cards secundários */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full bg-orange-200 rounded-3xl p-6 px-8 group overflow-hidden'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#FFAD51] bg-clip-text text-transparent max-w-40'>
                                {content.heroCardTitle1}
                            </p>
                            <p className='flex items-center gap-1 mt-4'>Ver mais <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /></p>
                        </div>
                        <DynamicImage
                            src={content.heroCard1Image}
                            fallback={assets.hero_product_img1}
                            alt="Card 1"
                            className='w-35 h-28 object-cover rounded-xl'
                        />
                    </div>

                    <div className='flex-1 flex items-center justify-between w-full bg-blue-200 rounded-3xl p-6 px-8 group overflow-hidden'>
                        <div>
                            <p className='text-3xl font-medium bg-gradient-to-r from-slate-800 to-[#78B2FF] bg-clip-text text-transparent max-w-40'>
                                {content.heroCardTitle2}
                            </p>
                            <p className='flex items-center gap-1 mt-4'>Ver mais <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /></p>
                        </div>
                        <DynamicImage
                            src={content.heroCard2Image}
                            fallback={assets.hero_product_img2}
                            alt="Card 2"
                            className='w-35 h-28 object-cover rounded-xl'
                        />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero