"use client"

import { useCallback } from 'react'
import { LucideSearch } from 'lucide-react'
import { useLocation, useSearchParams, redirect } from 'react-router-dom'
import ThemeToggle from '@/lib/ThemeToggle'

const Nav = ({setSearch}: any) => {
    const location = useLocation()
    const searchParams = useSearchParams()

    const debounce = (func: any, delay: number) => {
        let timer: any
        return (...args: any) => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            func(...args)
          }, delay)
        }
      }
// Debounce (delay) for search 

const createQueryString = debounce(useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      setSearch (value)
      params.set(name, value)
      redirect(`${location}?${params.toString()}`)
    }, 
      [searchParams, location, setSearch]
  ), 500)
// Searchy. Delay of 500 milliseconds

  return (
    <nav className='bg-rose-800 shadow-xl sticky top-0'>
        <div className='mx-auto px-3 py-4 flex'>
            <div className='flex-grow flex justify-center relative'>
                <input
                    type='text'
                    placeholder='Search for Kanto Pokemon'
                    className='w-full max-w-md border border-red-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-black placeholder-gray-400 md:ml-28'
                    onChange={(e) => { createQueryString('search', e.target.value) }}
                />
                <div className='relative right-10 top-7 transform -translate-y-1/2 text-black'>
                    <LucideSearch />
                </div>
            </div>
            <div className="mr-48">
                <ThemeToggle />
            </div>
        </div>
    </nav>
)
}

export default Nav


