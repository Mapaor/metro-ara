import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metro Ara",
  description: "Horaris del metro en temps real.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}
