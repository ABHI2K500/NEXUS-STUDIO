"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface BlogSearchProps {
  isNewsletter?: boolean
}

export function BlogSearch({ isNewsletter = false }: BlogSearchProps) {
  const [value, setValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNewsletter) {
      // Handle newsletter subscription
      console.log("Newsletter subscription:", value)
      // You would typically call an API here
    } else {
      // Handle search
      console.log("Search for:", value)
      // You would typically redirect to search results page
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="flex">
        <Input 
          placeholder={isNewsletter ? "Your email address" : "Search articles..."} 
          className="flex-1" 
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {!isNewsletter && <Button type="submit" className="ml-2">Search</Button>}
      </div>
      {isNewsletter && <Button type="submit" className="w-full mt-2">Subscribe</Button>}
    </form>
  )
} 