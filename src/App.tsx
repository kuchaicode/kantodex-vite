import { Suspense } from 'react'
// import { Inter } from "next/font/google";
import "./index.css";
// import { ThemeProvider } from "./components/ThemeProvider";
import {
  Routes,
  Route,
  BrowserRouter
  // Link,
  // useNavigate,
  // useLocation,
  // Navigate,
  // Outlet,
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
            <Nav />
            <Routes>
              <Route index element={<CardData />} /> 
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