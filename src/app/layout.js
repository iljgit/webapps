import Providers from "./providers";
import ScrollRestorer from "@/components/ScrollRestorer";

export const metadata = {
  title: "iSeeMy: Web Apps",
  description: "UK-based Web Applet Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ScrollRestorer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
