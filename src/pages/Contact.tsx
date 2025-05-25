import Header from "@/components/Header";
import "@styles/Contact.scss";

export default function Contact() {
	return (
		<div>
			<Header />

			<div className="contact">
				<h1 className="contact__title">Contact Me</h1>
				<div className="contact-links">
					<a
						className="contact-links-link contact-links-link--instagram"
						href="https://www.instagram.com/f1r3wave"
					>
						<img
							className="contact-links-link__image"
							src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
							alt="Instagram Logo"
						/>
					</a>
					<a
						className="contact-links-link contact-links-link--email"
						href="mailto:erichantke@hotmail.com"
					>
						<img
							className="contact-links-link__image"
							src="https://static.vecteezy.com/system/resources/thumbnails/014/440/980/small_2x/email-message-icon-design-in-blue-circle-png.png"
							alt="Instagram Logo"
						/>
					</a>
				</div>
			</div>
		</div>
	);
}
