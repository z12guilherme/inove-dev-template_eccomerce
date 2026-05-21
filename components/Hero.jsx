'use client'
import { assets } from '@/assets/assets'
import { ArrowRightIcon, ChevronRightIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import CategoriesMarquee from './CategoriesMarquee'
import { getAppearance, defaultAppearance } from '@/lib/appearanceStore'
import { getStoredTheme, defaultTheme } from '@/lib/themeProvider'

const Hero = () => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'R$'
    const [content, setContent] = useState(defaultAppearance)
    const [theme, setTheme] = useState(defaultTheme)

    useEffect(() => {
        setContent(getAppearance())
        setTheme(getStoredTheme())

        const handleStorage = () => {
            setContent(getAppearance())
            setTheme(getStoredTheme())
        }
        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    return (
        <div className='mx-6'>
            <div className='flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10'>

                {/* Card principal do Hero */}
                <div className='relative flex-1 flex flex-col rounded-3xl xl:min-h-100 group' style={{ backgroundColor: theme.primaryLight }}>
                    <div className='p-5 sm:p-16'>

                        {/* Badge de novidade */}
                        <div className='inline-flex items-center gap-3 pr-4 p-1 rounded-full text-xs sm:text-sm' style={{ backgroundColor: theme.primaryMid, color: theme.primaryDark }}>
                            <span className='px-3 py-1 max-sm:ml-1 rounded-full text-white text-xs' style={{ backgroundColor: theme.primary }}>
                                {content.heroBadgeLabel}
                            </span>
                            {content.heroBadgeText}
                            <ChevronRightIcon className='group-hover:ml-2 transition-all' size={16} />
                        </div>

                        {/* Headline */}
                        <h2 className='text-3xl sm:text-5xl leading-[1.2] my-3 font-medium max-w-xs sm:max-w-md' style={{ color: theme.primaryDark }}>
                            {content.heroHeadline}
                        </h2>

                        {/* Preço de entrada */}
                        <div className='text-sm font-medium mt-4 sm:mt-8' style={{ color: theme.primaryDark }}>
                            <p>A partir de</p>
                            <p className='text-3xl'>{currency}{content.heroStartingPrice}</p>
                        </div>

                        {/* CTA */}
                        <button className='text-white text-sm py-2.5 px-7 sm:py-5 sm:px-12 mt-4 sm:mt-10 rounded-md hover:scale-103 active:scale-95 transition' style={{ backgroundColor: theme.accent }}>
                            {content.heroButtonText}
                        </button>
                    </div>

                    <Image
                        className='sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm'
                        src={assets.hero_model_img}
                        alt=""
                        priority
                    />
                </div>

                {/* Cards secundários */}
                <div className='flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm text-slate-600'>
                    <div className='flex-1 flex items-center justify-between w-full rounded-3xl p-6 px-8 group' style={{ backgroundColor: theme.card2Bg || '#fed7aa' }}>
                        <div>
                            <p className='text-3xl font-medium bg-clip-text text-transparent max-w-40' style={{ backgroundImage: `linear-gradient(to right, #1e293b, ${theme.card2Text || '#FFAD51'})` }}>
                                {content.heroCardTitle1}
                            </p>
                            <p className='flex items-center gap-1 mt-4'>{content.heroCardLink1 || 'Ver mais'} <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /></p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img1} alt="" />
                    </div>

                    <div className='flex-1 flex items-center justify-between w-full rounded-3xl p-6 px-8 group' style={{ backgroundColor: theme.card3Bg || '#bfdbfe' }}>
                        <div>
                            <p className='text-3xl font-medium bg-clip-text text-transparent max-w-40' style={{ backgroundImage: `linear-gradient(to right, #1e293b, ${theme.card3Text || '#78B2FF'})` }}>
                                {content.heroCardTitle2}
                            </p>
                            <p className='flex items-center gap-1 mt-4'>{content.heroCardLink2 || 'Ver mais'} <ArrowRightIcon className='group-hover:ml-2 transition-all' size={18} /></p>
                        </div>
                        <Image className='w-35' src={assets.hero_product_img2} alt="" />
                    </div>
                </div>
            </div>
            <CategoriesMarquee />
        </div>
    )
}

export default Hero