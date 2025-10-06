import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { ConfigProvider } from '@/contexts/ConfigContext';
import './index.scss';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConfigProvider>
        <body>
          <Header />
          {children}
          <Footer currentYear={new Date().getFullYear()} />
        </body>
      </ConfigProvider>
    </html>
  );
}
