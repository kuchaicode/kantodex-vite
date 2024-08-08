import { Suspense, useState } from 'react'
import "./index.css";
import {
  Routes,
  Route,
  BrowserRouter
} from "react-router-dom";
import CardData from './components/CardData';
import PokedataProvider from "./components/PokedataProvider";
import Nav from "./components/Nav"
import PokePage from './pages/PokePage';



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ search, setSearch ] = useState('')
  return (
    <>
      {/* <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      > */}
        <Suspense>
        <PokedataProvider>
          <BrowserRouter>
            <Nav setSearch={setSearch} />
            <Routes>
              <Route index element={<CardData keyword={search} />} /> 
              <Route path="/:name" element={<PokePage />} />
            </Routes>
          </BrowserRouter>
          {children} 
        </PokedataProvider>
        </Suspense>
      {/* </ThemeProvider> */}
    </>
  );
}