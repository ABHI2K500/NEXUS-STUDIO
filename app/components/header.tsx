"use client"

import Link from "next/link"
import { NavMenu } from "./nav-menu"
import LanguageSelector from "@/components/language-selector"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            NEXUS
          </Link>
          
          <div className="flex items-center space-x-4">
            <NavMenu />
            <LanguageSelector />
          </div>
        </div>
      </div>
    </header>
  )
} 