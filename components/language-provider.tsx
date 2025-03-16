"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es" | "fr" | "de" | "zh"

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

// Sample translations
const translations: Translations = {
  "home.hero.title": {
    en: "Transforming Ideas into Digital Reality ✨",
    es: "Transformando Ideas en Realidad Digital ✨",
    fr: "Transformer des Idées en Réalité Numérique ✨",
    de: "Ideen in digitale Realität umwandeln ✨",
    zh: "将创意转化为数字现实 ✨",
  },
  "home.hero.subtitle": {
    en: "Specializing in live streaming, media production, digital marketing, and event management",
    es: "Especialización en transmisión en vivo, producción de medios, marketing digital y gestión de eventos",
    fr: "Spécialisation dans la diffusion en direct, la production médiatique, le marketing numérique et la gestion d'événements",
    de: "Spezialisierung auf Live-Streaming, Medienproduktion, digitales Marketing und Eventmanagement",
    zh: "专注于直播、媒体制作、数字营销和活动管理",
  },
  "home.cta.explore": {
    en: "Explore Our Services 🚀",
    es: "Explora Nuestros Servicios 🚀",
    fr: "Découvrez Nos Services 🚀",
    de: "Entdecken Sie Unsere Dienstleistungen 🚀",
    zh: "探索我们的服务 🚀",
  },
  "nav.home": {
    en: "Home",
    es: "Inicio",
    fr: "Accueil",
    de: "Startseite",
    zh: "首页",
  },
  "nav.about": {
    en: "About",
    es: "Nosotros",
    fr: "À Propos",
    de: "Über Uns",
    zh: "关于我们",
  },
  "nav.services": {
    en: "Services",
    es: "Servicios",
    fr: "Services",
    de: "Dienstleistungen",
    zh: "服务",
  },
  "nav.portfolio": {
    en: "Portfolio",
    es: "Portafolio",
    fr: "Portfolio",
    de: "Portfolio",
    zh: "作品集",
  },
  "nav.blog": {
    en: "Blog",
    es: "Blog",
    fr: "Blog",
    de: "Blog",
    zh: "博客",
  },
  "nav.esports": {
    en: "Esports",
    es: "Esports",
    fr: "E-Sports",
    de: "E-Sport",
    zh: "电子竞技",
  },
  "nav.join_us": {
    en: "Join Us",
    es: "Únete",
    fr: "Rejoignez-Nous",
    de: "Mitmachen",
    zh: "加入我们",
  },
  "nav.contact": {
    en: "Contact",
    es: "Contacto",
    fr: "Contact",
    de: "Kontakt",
    zh: "联系我们",
  },
  "nav.contact_us": {
    en: "Contact Us",
    es: "Contáctanos",
    fr: "Contactez-Nous",
    de: "Kontaktieren Sie Uns",
    zh: "联系我们",
  },
  "footer.rights": {
    en: "All rights reserved.",
    es: "Todos los derechos reservados.",
    fr: "Tous droits réservés.",
    de: "Alle Rechte vorbehalten.",
    zh: "版权所有。",
  },
  "footer.terms": {
    en: "Terms of Service",
    es: "Términos de Servicio",
    fr: "Conditions d'Utilisation",
    de: "Nutzungsbedingungen",
    zh: "服务条款",
  },
  "footer.privacy": {
    en: "Privacy Policy",
    es: "Política de Privacidad",
    fr: "Politique de Confidentialité",
    de: "Datenschutzrichtlinie",
    zh: "隐私政策",
  },
  "footer.sitemap": {
    en: "Sitemap",
    es: "Mapa del Sitio",
    fr: "Plan du Site",
    de: "Seitenübersicht",
    zh: "网站地图",
  },
  // Add more translations as needed
}

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  // Load language preference from localStorage on client side
  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

