import { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [imgData, setImgData] = useState([]);

	useEffect(() => {
		fetchImages()
			.then(resolve => setImgData(resolve))
			.catch(error => console.log(error));
	}, []);

	return (
		<div className="app">
			{imgData.map(data => {
				return (
					<section key={data.id}>
						<span>{data.name}</span>
					</section>
				);
			})}
		</div>
	);
}

async function fetchImages() {
	const response = await fetch('https://pokeapi.co/api/v2/pokemon');
	const json = await response.json();

	const imgData = [];
	for (const entry of json.results) {
		const entryResponse = await fetch(entry.url);
		const data = await entryResponse.json();
		imgData.push({
			id: data.id,
			name: data.name,
			imgSrc: data.sprites.front_default,
		});
	}
	return imgData;
}

export default App;
