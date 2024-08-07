import { Suspense } from 'react'
// import type { Metadata } from "next";
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


// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Kantodex",
//   description: "Generation 1 Pokedex with tracking",
// };

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
            </Routes>
          </BrowserRouter>

          {children} 
        </PokedataProvider>
        </Suspense>
      {/* </ThemeProvider> */}
    </>
  );
}