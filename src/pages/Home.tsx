import Header from "@/components/Header";
import "@styles/Home.scss";

export default function Home() {
	return (
		<div>
			<Header />

			<div className="home">
				<div className="home-text">
					<h1 className="home-text__headline">Portfolio</h1>
					<p className="home-text__paragraph">
						As a passionate <b>hobby photographer</b> , I capture the unique
						beauty and atmosphere of various places. Join me on a visual journey
						through my lens.
					</p>
					<a href="/gallery" className="home-button">
						My Gallery
					</a>
				</div>
			</div>
		</div>
	);
}
