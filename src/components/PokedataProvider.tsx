"use client"
import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

type Props = {}

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