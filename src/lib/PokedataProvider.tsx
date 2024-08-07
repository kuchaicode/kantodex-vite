"use client"
import { useState } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const PokedataProvider = ({ children }: any) => {

const [client] = useState(new QueryClient())
  
return (
  <>
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  </>
)
}

export default PokedataProvider