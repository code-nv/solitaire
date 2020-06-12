const app = {};
app.deck = [];
app.hand = [];
app.waste = [];
app.board = [];

app.foundations = { hearts: [], diamonds: [], clubs: [], spades: [] };
document.addEventListener("DOMContentLoaded", function () {
	app.createDeck();
	app.dealCards();
	app.visualizeTable();
	app.shuffleDeck();
	app.addListeners();
});

app.createDeck = () => {
	for (let i = 1; i < 14; i++) {
		let suit;
		let suitLogic;
		for (let y = 0; y < 4; y++) {
			y == 0
				? ((suit = "♥"), (suitLogic = "hearts"))
				: y == 1
				? ((suit = "♦"), (suitLogic = "diamonds"))
				: y == 2
				? ((suit = "♣"), (suitLogic = "clubs"))
				: ((suit = "♠"), (suitLogic = "spades"));
			y < 2 ? (colour = 1) : (colour = 2);
			app.deck.push({
				value: i,
				faceValue: i,
				suit: suit,
				suitLogic: suitLogic,
				colour: colour,
			});
		}
	}
	app.deck.map((card) => {
		card.faceValue == 1
			? (card.faceValue = "A")
			: card.faceValue == 11
			? (card.faceValue = "J")
			: card.faceValue == 12
			? (card.faceValue = "Q")
			: card.faceValue == 13
			? (card.faceValue = "K")
			: null;
	});
};
app.rng = () => {
	return Math.floor(Math.random() * app.deck.length);
};
app.dealCards = () => {
	for (let i = 0; i < 7; i++) {
		let pile = [];
		for (let y = 0; y <= i; y++) {
			let index = app.rng();
			pile.push(app.deck[index]);
			app.deck.splice(index, 1);
		}
		app.board.push(pile);
	}
};

app.shuffleDeck = () => {
	while (app.deck.length > 0) {
		let index = app.rng();
		app.hand.push(app.deck[index]);
		app.deck.splice(index, 1);
	}
};

app.visualizeTable = () => {
	const htmlPile = document.getElementsByClassName("pile");
	for (let i = 0; i < 7; i++) {
		let htmlToAppend = "";
		app.board[i].forEach((card, index) => {
			index == app.board[i].length - 1
				? (htmlToAppend += `<div class="card up colour${card.colour}" data-cardindex="${index}" data-pileindex="${i}"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`)
				: (htmlToAppend += `<div class="card down colour${card.colour}" data-cardindex="${index}" data-pileindex="${i}"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`);
		});
		htmlPile[i].innerHTML = htmlToAppend;
	}
};
app.addListeners = () => {
	const hand = document.querySelector(".hand");
	hand.addEventListener("click", app.handLogic);
	const waste = document.querySelector(".waste");
	waste.addEventListener("click", app.wasteLogic);
	const piles = document.getElementsByClassName("pile");
	for (let i = 0; i < piles.length; i++) {
		const cards = piles[i].getElementsByClassName("card");
		app.activateCards(cards);
	}
};
// figure out why this is bugging out
app.handLogic = (e) => {
	const card = app.hand[0];
	app.waste.push(card);
	app.hand.shift();
	console.log(app.hand, app.waste);
	document.querySelector(
		".waste"
	).innerHTML = `<div class="currentCard card up colour${card.colour}" data-cardindex="0" data-pileindex=waste"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`;
};

app.wasteLogic = function (e) {
	const cardPicked = 0;
	const targetCard = app.waste[app.waste.length - 1];
	const pilePicked = "waste";
	app.checkFoundations(targetCard, cardPicked, pilePicked);
	if (app.foundationMove == true) {
		app.foundationMove = false;
		return;
	} else {
		app.board.forEach((pile, i) => {
			const moves = pile[pile.length - 1];
			if (!moves) {
				return;
			}
			if (i != parseInt(pilePicked)) {
				if (moves.value == targetCard.value + 1 && moves.colour != targetCard.colour) {
					const movingCards = app.waste.splice(app.waste.length - 1);
					pile.push(...movingCards);
					console.log(pile);
					app.visualizeMove(pilePicked, cardPicked, i);
				}
			}
		});
	}
};
// where cards is the cards in a respective pile
app.activateCards = (cards) => {
	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener("click", function (e) {
			console.log("clicked", this);
			const check = [...this.classList];
			if (check.includes("down")) {
				return;
			}
			// using data attributes to manipulate the js arrays
			const cardPicked = this.getAttribute("data-cardindex");
			const pilePicked = this.getAttribute("data-pileindex");
			const targetCard = app.board[pilePicked][cardPicked];
			app.checkFoundations(targetCard, cardPicked, pilePicked);
			if (app.foundationMove == true) {
				console.log("foundations is true");
				app.foundationMove = false;
				return;
			}
			console.log("foundations is false");
			app.board.forEach((pile, i) => {
				console.log(cardPicked);
				const moves = pile[pile.length - 1];
				if (!moves) {
					return;
				}
				if (i != parseInt(pilePicked)) {
					if (moves.value == targetCard.value + 1 && moves.colour != targetCard.colour) {
						console.log(cardPicked, app.board[pilePicked], app.board[pilePicked][parseInt(cardPicked)]);
						const movingCards = app.board[pilePicked].splice(cardPicked);
						pile.push(...movingCards);
						app.visualizeMove(pilePicked, cardPicked, i);
					}
				}
			});
		});
	}
};
app.foundationMove = false;
app.checkFoundations = (targetCard, cardPicked, pilePicked) => {
	console.log(targetCard);
	let movingCards;
	let origin;
	if (pilePicked == "waste") {
		movingCards = [app.waste[cardPicked]];
		origin = app.waste;
	} else {
		movingCards = [app.board[pilePicked][cardPicked]];
		origin = app.board[pilePicked];
	}
	for (let type in app.foundations) {
		if (type == targetCard.suitLogic && app.foundations[type].length == 0 && targetCard.value == 1) {
			console.log(type, targetCard.suitLogic);
			app.foundations[type].push(...movingCards);
			origin.splice(cardPicked);
			app.visualizeMove(pilePicked, cardPicked, type);
		} else if (type == targetCard.suitLogic && app.foundations[type].length == targetCard.value - 1) {
			console.log(type, targetCard.suitLogic);
			// const movingCards = app.board[pilePicked].splice(cardPicked);
			app.foundations[type].push(...movingCards);
			console.log(pilePicked, cardPicked, type);
			origin.splice(cardPicked);
			app.visualizeMove(pilePicked, cardPicked, type);
			app.foundationMove = true;
		}
	}
};
// moves the DOM node of cards to their destination pile.
// re-indexes the data-cardindex of the cards in the destination pile
app.visualizeMove = (pilePicked, cardPicked, endPile) => {
	const startPile = document.querySelector(`.pile${pilePicked}`);
	const startCards = startPile.getElementsByClassName("card");
	console.log(startPile, startCards, cardPicked, "visualize move");
	// this will move every card on top of the chosen cards as well because
	while (cardPicked < startCards.length) {
		const grabNode = startCards[cardPicked];
		// grabNode.parentNode.removeChild(grabNode);
		grabNode.setAttribute("data-pileindex", endPile);
		document.querySelector(`.pile${endPile}`).appendChild(grabNode);
		if (app.board[endPile]) {
			const pileToIterateThrough = document.querySelector(`.pile${endPile}`);
			const cardsToIndex = pileToIterateThrough.getElementsByClassName("card");
			for (let i = 0; i < cardsToIndex.length; i++) {
				cardsToIndex[i].setAttribute("data-cardindex", i);
			}
		} else {
			grabNode.setAttribute("data-cardindex", app.foundations[endPile].length - 1);
		}
	}
	const newTopCard = startCards[cardPicked - 1];
	if (!newTopCard) {
		return;
	}
	newTopCard.classList.remove("down");
	newTopCard.classList.add("up");
};

// in checkfoundations function, grab the target card node and move it to the foundations pile <3
// make deck reveal third card,
// make deck reveal previous discarded cards if deck card is used
// logic for alternate colour descending number placing options
