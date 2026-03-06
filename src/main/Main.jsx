import Home from '@/components/Home'
import React from 'react'
import dynamic from 'next/dynamic'

const Magicalcore = dynamic(() => import('@/components/Magicalcore'), { ssr: true })
const Magichappence = dynamic(() => import('@/components/Magichappence'), { ssr: true })
const AIart = dynamic(() => import('@/components/AIart'), { ssr: true })
const Soulmateart = dynamic(() => import('@/components/Soulmateart'), { ssr: true })
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true })
const FAQ = dynamic(() => import('@/components/FAQ'), { ssr: true })
const Contectus = dynamic(() => import('@/components/Contectus'), { ssr: true })

const Main = ({lang, country}) => {

  return (
    <div>
        <Home hero={lang.hero} country={country} />
        <Magicalcore magicalCore={lang.magicalCore} country={country} />
        <Magichappence magicHappens={lang.magicHappens} country={country} />
         <AIart aiArt={lang.aiArt} country={country} />
        <Soulmateart soulmateArt={lang.soulmateArt} country={country} />
        <Testimonials testimonial={lang.testimonial} />
        <FAQ faqs={lang.faqs} country={country} />
        <Contectus contact={lang.contact} />
    </div>
  )
}

export default Main