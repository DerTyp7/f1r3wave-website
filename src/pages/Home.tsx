import Header from "@/components/Header";
import { useConfig } from "@/contexts/configExports";
import "@styles/Home.scss";

export default function Home() {
  const { config } = useConfig();

  return (
    <div>
      <Header />

      <div className="home">
        <div className="home-text">
          <h1 className="home-text__headline" dangerouslySetInnerHTML={{ __html: config?.home.headline || "" }}></h1>
          <p className="home-text__paragraph" dangerouslySetInnerHTML={{ __html: config?.home.text || "" }}></p>
          <a href="/gallery" className="home-button" dangerouslySetInnerHTML={{ __html: config?.home.buttonText || "" }}></a>
        </div>
      </div>
    </div>
  );
}
