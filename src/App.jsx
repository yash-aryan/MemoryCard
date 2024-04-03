import './App.css';
import { useEffect, useState } from 'react';
import { Card } from './components/Card';

function App() {
	const [imgData, setImgData] = useState({ initial: [], current: [] });
	const [score, setScore] = useState({ current: 0, highest: 0 });

	useEffect(() => {
		fetchImages()
			.then(resolve => setImgData({ initial: resolve, current: resolve }))
			.catch(error => console.error(error));
	}, []);

	return (
		<>
			<div>
				<span>Score: {score.current}</span>
				<br />
				<span>HighScore: {score.highest}</span>
			</div>
			<ul className="app">
				{imgData.current.map(data => {
					return (
						<Card
							key={data.id}
							id={data.id}
							name={data.name}
							imgSrc={data.imgSrc}
							onClick={handleClick}
						/>
					);
				})}
			</ul>
		</>
	);

	function handleClick(targetId) {
		// Updates score & Randomizes imgData.current states.
		const isRepeatClick = imgData.current.find(data => data.id === targetId).isClicked;

		// Checks if card has been clicked before.
		if (isRepeatClick) {
			// Runs if card has been clicked.
			setScore({ ...score, current: 0 });
			setImgData({ ...imgData, current: [...imgData.initial] });
			return;
		}

		const newScore = score.current + 1;

		if (score.current === score.highest) {
			setScore({ current: newScore, highest: newScore });
		} else setScore({ ...score, current: newScore });

		// Sets isClicked = true of target & Sets state.
		const imgDataCopy = [...imgData.current];
		const targetIndex = imgDataCopy.findIndex(data => data.id === targetId);
		const targetData = { ...imgDataCopy[targetIndex] };
		targetData.isClicked = true;
		imgDataCopy[targetIndex] = targetData;
		setImgData({ ...imgData, current: randomize(imgDataCopy) });
	}
}

async function fetchImages() {
	// Fetches array of objects containing urls for each pokemon.
	const response = await fetch('https://pokeapi.co/api/v2/pokemon');
	const json = await response.json();

	// Fetches data each url & pushes required values to imgData.
	const imgData = [];
	for (const entry of json.results) {
		const entryResponse = await fetch(entry.url);
		const data = await entryResponse.json();
		imgData.push({
			id: data.id,
			name: data.name,
			imgSrc: data.sprites.front_default,
			isClicked: false,
		});
	}
	return imgData;
}

function randomize(inputArr) {
	return inputArr
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
}

export default App;
