import Providers from "./providers";

export const metadata = {
  title: "iSeeMy: Web Apps",
  description: "UK-based Web Applet Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
