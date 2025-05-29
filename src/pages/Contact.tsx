import Header from "@/components/Header";
import { useConfig } from "@/contexts/configExports";
import "@styles/Contact.scss";
import { useState } from "react";

export default function Contact() {
  const { config } = useConfig();
  const [currentHoverUrl, setCurrentHoverUrl] = useState<string>("");

  return (
    <div>
      <Header />

      <div className="contact">
        <h1 className="contact__title">{config?.contact.headline}</h1>
        <div className="contact-links">
          {config?.contact?.links?.map((link) => (
            <a
              key={link.url}
              className={`contact-links-link`}
              href={link.url}
              onMouseEnter={() => setCurrentHoverUrl(link.url)}
              onMouseLeave={() => setCurrentHoverUrl("")}
              style={
                currentHoverUrl === link.url
                  ? {
                      backgroundColor: link.hoverColor,
                    }
                  : {}
              }
            >
              <img className="contact-links-link__image" src={link.image.src} alt={link.image.alt} />
            </a>
          ))}
        </div>

        {config?.contact.imprint.enable ? (
          <div className="imprint">
            <h2 className="imprint-headline">{config?.contact.imprint.headline}</h2>
            <span>{config?.contact.imprint.name}</span>
            <span>{config?.contact.imprint.address}</span>
            <span>{config?.contact.imprint.country}</span>
            <span>{config?.contact.imprint.email}</span>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
