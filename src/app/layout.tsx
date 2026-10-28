import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metro",
  description: "Línies i arribades del metro.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
