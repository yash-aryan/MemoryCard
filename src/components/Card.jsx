export function Card({ id, name, imgSrc, onClick }) {
	return (
		<li>
			<button type="button" onClick={() => onClick(id)}>
				<figure>
					<img src={imgSrc} alt={name} />
					<figcaption>{name}</figcaption>
				</figure>
			</button>
		</li>
	);
}
