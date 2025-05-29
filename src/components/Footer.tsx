import "@styles/Footer.scss";

export default function Footer({ isInLandingPage }: { isInLandingPage?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`footer ${isInLandingPage ? "footer--landing-page" : ""}`}>
      <a href="https://github.com/DerTyp7/f1r3wave-website" className="footer__github">
        View Source Code on GitHub
      </a>
      <span className="footer__copyright">&#169; {currentYear} Janis Meister. All rights reserved.</span>
    </div>
  );
}
