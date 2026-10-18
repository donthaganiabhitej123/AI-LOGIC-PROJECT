
import type { Metadata } from "next";

import Navbar from "../components/navbar";
import StoreProvider from "../store/provider";
import "./globals.css";
import Providers from "./provider";

export const metadata: Metadata = {
  title: "User CRUD",
  description: "User CRUD Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </StoreProvider>
      </body>
    </html>
  );
}
