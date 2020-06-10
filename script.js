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
	for (let i = 1; i < 14; i++) {
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
	const faceUpCards = document.getElementsByClassName("card");
	for (let i = 0; i < faceUpCards.length; i++) {
		faceUpCards[i].removeEventListener();
		faceUpCards[i].addEventListener("click", function (e) {
			console.log("clicked");
			const check = [...faceUpCards[i].classList]
			if(check.includes('down')){
				return
			}
			// using data attributes to manipulate the js arrays
			const cardPicked = this.getAttribute("data-cardindex");
			const pilePicked = this.getAttribute("data-pileindex");
			const targetCard = app.board[pilePicked][cardPicked];
			app.board.forEach((pile, i) => {
				const moves = pile[pile.length - 1];
				if (i != parseInt(pilePicked)) {
					if (moves.value == targetCard.value + 1 && moves.colour != targetCard.colour) {
						const difference = pile.length - cardPicked + 1;
						const test = app.board[pilePicked].splice(cardPicked, difference);
						pile.push(...test);
						app.visualizeMove(pilePicked,cardPicked,i);
					}
				}
			});
		});
	}
};

app.visualizeMove = (pilePicked,cardPicked, endPile) =>{
	let htmlToTake ='';
	const startPile = document.querySelector(`.pile${pilePicked}`)
	const startCards = startPile.getElementsByClassName('card')
	for (let i = cardPicked; i<startCards.length;i++){
		htmlToTake += startCards[i].outerHTML
		startCards[i].parentNode.removeChild(startCards[i]);
		document.querySelector(`.pile${endPile}`).innerHTML += htmlToTake;
	}
	const newTopCard = startCards[cardPicked-1];
	newTopCard.classList.remove('down')
	newTopCard.classList.add('up')

}

// make last card in a pile face up ✔️
// read about dom manipulation to see if i can move the cards to other piles and thus move the event listener with them.
// make deck reveal third card,
// make deck reveal previous discarded cards if deck card is used
// logic for alternate colour descending number placing options
