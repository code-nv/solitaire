const app = {};
app.deck = [];
app.board = [];
document.addEventListener("DOMContentLoaded", function () {
	app.createDeck();
	app.dealCards();
	app.visualizeTable();
	app.addListeners();
});

app.createDeck = () => {
	for (let i = 1; i < 8; i++) {
		let suit;
		for (let y = 0; y < 4; y++) {
			y == 0 ? (suit = "♥") : y == 1 ? (suit = "♦") : y == 2 ? (suit = "♣") : suit == "♠";
			y < 2 ? (colour = 1) : (colour = 2);
			app.deck.push({
				value: i,
				faceValue: i,
				suit: suit,
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
	// console.log(app.board);
	// console.log(app.deck)
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
	const piles = document.getElementsByClassName("pile");
	for (let i = 0; i < piles.length; i++) {
		const cards = piles[i].getElementsByClassName("card");
		app.activateCards(cards);
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
			app.board.forEach((pile, i) => {
				const moves = pile[pile.length - 1];
				if (!moves) {
					return;
				}
				if (i != parseInt(pilePicked)) {
					if (moves.value == targetCard.value + 1 && moves.colour != targetCard.colour) {
						// const difference = pile.length - cardPicked + 1;
						const test = app.board[pilePicked].splice(cardPicked);
						pile.push(...test);
						app.visualizeMove(pilePicked, cardPicked, i);
					}
				}
			});
		});
	}
};

app.visualizeMove = (pilePicked, cardPicked, endPile) => {
	let nodeCount = 0;
	const startPile = document.querySelector(`.pile${pilePicked}`);
	const startCards = startPile.getElementsByClassName("card");
	// this will move every card on top of the chosen cards as well because 
	while(cardPicked < startCards.length) {	
		console.log('fizz')
		const grabNode = startCards[cardPicked];
		// grabNode.parentNode.removeChild(grabNode);
		grabNode.setAttribute("data-pileindex", endPile);
		grabNode.setAttribute("data-cardindex", app.board[endPile].length - 1);
		document.querySelector(`.pile${endPile}`).appendChild(grabNode);
	}
// 	while(cardPicked < startCards.length) {	
// 		console.log('buzz')
// const nodeToRemove = startCards[startCards.length-1]
// 	nodeToRemove.parentNode.removeChild(nodeToRemove);
// 	}
	const newTopCard = startCards[cardPicked - 1];
	if (!newTopCard) {
		return;
	}
	newTopCard.classList.remove("down");
	newTopCard.classList.add("up");
};

// make last card in a pile face up ✔️
// read about dom manipulation to see if i can move the cards to other piles and thus move the event listener with them.
// make deck reveal third card,
// make deck reveal previous discarded cards if deck card is used
// logic for alternate colour descending number placing options
