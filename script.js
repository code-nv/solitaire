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
				? (htmlToAppend += `<div class="card up colour${card.colour}" tabindex="0" data-cardindex="${index}" data-pileindex="${i}"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`)
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
	const dummyCard = document.querySelector(".dummyCard");
	const waste = document.querySelector(".waste");
	if (app.hand.length == 0) {
		console.log("emptyHand");
		dummyCard.classList.remove("emptyHand");
		app.hand = [...app.waste];
		app.waste.length = 0;
		waste.innerHTML = "";
	} else {
		const card = app.hand[0];
		app.waste.push(card);
		app.hand.shift();
		console.log(app.hand, app.waste);
		waste.innerHTML = `<div class="currentCard card up colour${card.colour}" data-cardindex="0" data-pileindex=waste"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`;
		app.hand.length == 0 ? dummyCard.classList.add("emptyHand") : null;
	}
};

app.wasteLogic = function (e) {
	const cardPicked = 0;
	const targetCard = app.waste[app.waste.length - 1];
	const pilePicked = "waste";
	const suitOfWaste = targetCard.suitLogic;
	app.checkFoundations(targetCard, cardPicked, pilePicked);
	if (app.foundationMove == true) {
		let movedCard = document.querySelector(`.pile${suitOfWaste}`).children;
		movedCard = movedCard[movedCard.length - 1];
		movedCard.addEventListener("click", function () {
			app.cardFunctionality(movedCard);
		});

		app.foundationMove = false;
		// shortening the root target
		// redefining card to reflect the new length of the waste array which has altered since the targetcard definition
		const card = app.waste[app.waste.length - 1];
		if (card == undefined) {
			return;
		}
		// population the waste pile with what should be underneath the card that was just moved
		document.querySelector(
			".waste"
		).innerHTML = `<div class="currentCard card up colour${card.colour}" tabindex="0" data-cardindex="0" data-pileindex=waste"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`;
	} else {
		let stop = false;
		app.board.forEach((pile, i) => {
			// this is to prevent the function from running twice if there are more than one move available
			if (stop == true) {
				return;
			}
			if (i != parseInt(pilePicked)) {
				if (pile.length == 0 && targetCard.value == 13) {
					console.log(pile, "hit it");
					const movingCards = app.waste.splice(app.waste.length - 1);
					pile.push(...movingCards);
					console.log(pile);
					app.visualizeMove(pilePicked, cardPicked, i);
					const card = app.waste[app.waste.length - 1];
					app.addTableauFunctionality(i);
					if (card == undefined) {
						return;
					}
					document.querySelector(
						".waste"
					).innerHTML = `<div class="currentCard card up colour${card.colour}" tabindex="0" data-cardindex="0" data-pileindex=waste"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`;
					stop = true;
				} else {
					const moves = pile[pile.length - 1];
					if (!moves) {
						console.log("no moves");
						return;
					}
					if (moves.value == targetCard.value + 1 && moves.colour != targetCard.colour) {
						const movingCards = app.waste.splice(app.waste.length - 1);
						pile.push(...movingCards);
						app.visualizeMove(pilePicked, cardPicked, i);
						const card = app.waste[app.waste.length - 1];
						app.addTableauFunctionality(i);
						if (card == undefined) {
							return;
						}
						document.querySelector(
							".waste"
						).innerHTML = `<div class="currentCard card up colour${card.colour}" tabindex="0" data-cardindex="0" data-pileindex=waste"><p>${card.faceValue}</p><p>${card.suit}</p><p class="bigSuit">${card.suit}</p></div>`;
						stop = true;
					}
				}
			}
		});
	}
};
app.addTableauFunctionality = (i) => {
	const destPile = document.querySelector(`.pile${i}`).getElementsByClassName("card");
	destPile[destPile.length - 1].addEventListener("click", function () {
		app.cardFunctionality(this);
	});
};
// where cards is the cards in a respective pile
app.activateCards = (cards) => {
	for (let i = 0; i < cards.length; i++) {
		cards[i].addEventListener("click", function () {
			app.cardFunctionality(this);
		});
		cards[i].addEventListener("keypress", function (e) {
			e.code == "Enter" ? app.cardFunctionality(this) : null;
		});
	}
};
app.cardFunctionality = (target) => {
	// boolean to change origin value for dom targeting
	const isInFoundation = [...target.parentNode.classList].includes("foundation");
	// is the card revealed or facedown?
	const check = [...target.classList];
	if (check.includes("down")) {
		return;
	}
	// using data attributes to manipulate the js arrays
	const cardPicked = target.getAttribute("data-cardindex");
	const pilePicked = target.getAttribute("data-pileindex");
	let origin = "";
	isInFoundation ? (origin = app.foundations) : (origin = app.board);
	const targetCard = origin[pilePicked][cardPicked];
	if (isInFoundation == false && cardPicked == origin[pilePicked].length - 1) {
		app.checkFoundations(targetCard, cardPicked, pilePicked);
		if (app.foundationMove == true) {
			console.log("foundations is true");
			app.foundationMove = false;
			return;
		}
	}
	console.log("foundations is false");
	app.board.forEach((pile, i) => {
		const moves = pile[pile.length - 1];
		if (i != parseInt(pilePicked)) {
			if (!moves && targetCard.value == 13) {
				// console.log("hit it")[parseInt(cardPicked)];
				const movingCards = app.board[pilePicked].splice(cardPicked);
				pile.push(...movingCards);
				app.visualizeMove(pilePicked, cardPicked, i);
			} else if (!moves) {
				return;
			} else if (moves.value == targetCard.value + 1 && moves.colour != targetCard.colour) {
				const movingCards = origin[pilePicked].splice(cardPicked);
				pile.push(...movingCards);
				app.visualizeMove(pilePicked, cardPicked, i);
			}
		}
	});
};
app.foundationMove = false;
// will check if the clicked card is a valid move to the foundation piles. has conditional logic whether the card comes from the tableau or the waste pile.
app.checkFoundations = (targetCard, cardPicked, pilePicked) => {
	let movingCards;
	let origin;
	if (pilePicked == "waste") {
		cardPickedSplice = app.waste.length - 1;
		movingCards = [app.waste[cardPickedSplice]];
		origin = app.waste;
	} else {
		cardPickedSplice = cardPicked;
		movingCards = [app.board[pilePicked][cardPicked]];
		origin = app.board[pilePicked];
	}
	// if ace, start foundation pile
	for (let type in app.foundations) {
		if (type == targetCard.suitLogic && app.foundations[type].length == 0 && targetCard.value == 1) {
			// push card to foundation array
			app.foundations[type].push(...movingCards);
			// splice card from original array
			origin.splice(cardPickedSplice);
			// visualize the move
			app.visualizeMove(pilePicked, cardPicked, type);
			app.foundationMove = true;
			// if valid move (suit and 1 value diff, place)
		} else if (type == targetCard.suitLogic && app.foundations[type].length == targetCard.value - 1) {
			app.foundations[type].push(...movingCards);
			origin.splice(cardPickedSplice);
			app.visualizeMove(pilePicked, cardPicked, type);
			app.foundationMove = true;
			// console.log(app.foundationMove, app.waste, "this is your check");
		}
	}
};

// moves the DOM node of cards to their destination pile.
// re-indexes the data-cardindex of the cards in the destination pile
app.visualizeMove = (pilePicked, cardPicked, endPile) => {
	const startPile = document.querySelector(`.pile${pilePicked}`);
	const startCards = startPile.getElementsByClassName("card");
	// this will move every card on top of the chosen cards as well because
	while (cardPicked < startCards.length) {
		const grabNode = startCards[cardPicked];
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


// make deck reveal third card,
// if less than three in hand, reveal last card,
// add winner functionality
// add money?
// add timer?
// add animations?
