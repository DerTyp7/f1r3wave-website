import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ConfigProvider } from "@/contexts/ConfigContext";
import "./index.scss";

export default function RootLayout({
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
					<Footer isInLandingPage />
				</body>
			</ConfigProvider>
		</html>
	);
}
