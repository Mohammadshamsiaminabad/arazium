import "./globals.css";
import LayoutWrapper from "./layout-wrapper";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>
          {children}

        </LayoutWrapper>
      </body>
    </html>
  );
}
