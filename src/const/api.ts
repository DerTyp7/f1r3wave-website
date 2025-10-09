import { AppConfig } from '@/interfaces/config';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
export const imagesDir = path.join(dataDir, 'images');
export const jsonPath = path.join(dataDir, 'images.json');
export const configPath = path.join(dataDir, 'config.json');

export const configTemplate: AppConfig = {
  home: {
    headline: 'Portfolio',
    text: 'As a passionate <b>hobby photographer</b>, I capture the unique beauty and atmosphere of various places. Join me on a visual journey through my lens.',
    buttonText: 'Visit Gallery',
  },
  contact: {
    headline: 'Contact Me',
    links: [
      {
        url: 'https://www.instagram.com/f1r3wave',
        hoverColor: 'rgba(211, 122, 238, 0.25)',
        image: {
          src: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
          alt: 'Instagram Logo',
        },
      },
      {
        url: 'mailto:mail@mail.com',
        hoverColor: 'rgba(78, 172, 248, 0.25)',
        image: {
          src: 'https://static.vecteezy.com/system/resources/thumbnails/014/440/980/small_2x/email-message-icon-design-in-blue-circle-png.png',
          alt: 'Email Icon',
        },
      },
    ],
    imprint: {
      enable: false,
      headline: 'Imprint / Legal Notice',
      name: '[Your Full Name]',
      address: '[Your Full Address: Street and House Number, Postcode City]',
      country: '[YourCountry (e.g., Germany)]',
      email: '[Your E-Mail Address]',
    },
  },
};
