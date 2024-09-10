"use strict";

var $$ = (id) => document.getElementById(id);

var shuffledCards = [];
var scores = [
  {1: "Pair"},
  {2: "Two Pair"},
  {3: "Three of a Kind"},
  {4: "Straight"},
  {5: "Flush"},
  {6: "Full House"},
  {7: "Four of a Kind"},
  {8: "Royal FLush"}
];

$("document").ready(() => {

  // set the local storage to 100 if its null
  if (localStorage.getItem("score") == null) {
    localStorage.setItem("score", 100);
  }
  // Display the score on UI
  displayScore();

  // Cards Shuffling
  shuffledCards = shuffleCardsDeck();

  // display poker table
  displayPokerTable();

  // Animate logic of the cards
  animateCards();

  // Flip the cards once the animation is done
  flipCards();

  // Reset the game
  resetPoker();

});

function animateCards() {
    // display cards side by side and visible 
    $("#cards").css("visibility", "visible");

    $(".block").animate(
      {
        width: "94px",
        left: "100px",
      },
      {
        duration: 1500,
        queue: false,
        easing: "linear",
        step: function (now, fx) {
          $(".block").slice(1).css("left", now);
        },
        complete: afterAnimationComplete
      }
    );
};

function afterAnimationComplete() {
    // do something    
};

function displayPokerTable() {
    var table = $('#poker-table').DataTable({
        paging: false,
        ordering: false,
        info: false,
        searching: false,
        columnDefs: [
            // Left align both header and body content of columns 1 & 2
            { className: "dt-left", targets: [ 0, 1 ] }
         ]
      });
};

/**
 * Once the 'Bet' button is clicked, flip the remaining cards using animation.
 * Then the 'Bet' button changes to the 'Next Game' button.
 * Once the 'Next Game' button is clicked, the window is reloaded preserving the state of score.
 */
function flipCards() {
    $(".game-btn").click(() => {
        if ($$("bet") != null) {
          var bettingAmount = $("#bettingAmount").val();
          if (bettingAmount != null &&  bettingAmount > 0) {
            $(".card").css("transform", "rotateY(180deg)");
            $("#bet").attr("id", "nextGame");
            $("#nextGame").attr("value", "Next Game");

            evaluateCards(bettingAmount);
          }
        } else if ($$("nextGame") != null) {
          $("#nextGame").attr("id", "bet");
          $("#bet").attr("value", "Bet");


          // Store the score in localstorage
          localStorage.setItem("score", localStorage.getItem("score"));

          // reload the browser tab
          location.reload();
          
        }
    });
};

function displayScore() {
  var scoreElement = $$("score");
  var score = localStorage.getItem("score");

  if (scoreElement != null && score != null) {
    scoreElement.innerHTML = "Score: " + score;
  }
}

function resetPoker() {
  $("#resetButton").click(() => {
    localStorage.setItem("score", 100);
    displayScore();
  });
};

function shuffleCardsDeck() {
  var cardsDeck = Array.from(Array(52), (_, index) => index + 1);
  var shuffledDeck = cardsDeck.sort(function(){return .5 - Math.random()});
  var selectedCards = shuffledDeck.slice(0,5);

  // clear the present array to test.
  // selectedCards = [];
  // selectedCards.push(10, 11, 12, 13, 1); // Royal Flush
  // selectedCards.push(11, 24, 37, 50, 28);  // Four of a Kind
  // selectedCards.push(18, 5, 31, 21, 34); // Full house
  // selectedCards.push(15, 18, 20, 22, 24); // Flush
  // selectedCards.push(24, 12, 39, 40, 15); // Not a straight
  // selectedCards.push(17, 5, 32, 46, 34); // Straight
  // selectedCards.push(16, 29, 42, 19, 7); // Three of a Kind
  // selectedCards.push(4, 4, 50, 50, 40); // Two Pair
  // selectedCards.push(4, 4, 28, 50, 40); // Pair

  animateCardsWithShuffledDeck(selectedCards);
  return selectedCards;
};

function animateCardsWithShuffledDeck(cards) {

  for (let i = 0; i < cards.length; i++) {
    let image = new Image();
    image.src = "images/" + cards[i] + ".png";
    $$("card" + i).src = image.src;
  }

};

function evaluateCards(bettingAmount) {
  var localScore = localStorage.getItem("score");
  if (bettingAmount > 0 && bettingAmount <= 10) {
    var hand = "";

    shuffledCards.forEach(cardNumber => {
      if (cardNumber <= 13) {
        if (cardNumber == 1) {
          hand += ("AS ");
        } else if (cardNumber == 10) {
          hand += ("TS ");
        } else if (cardNumber == 11) {
          hand += ("JS ");
        } else if (cardNumber == 12) {
          hand += ("QS ");
        } else if (cardNumber == 13) {
          hand += ("KS ");
        } else {
          hand += (cardNumber + "S ");
        }
      } else if (cardNumber > 13 && cardNumber <= 26) {
        cardNumber = cardNumber - 13;
        if (cardNumber == 1) {
          hand += ("AH ");
        } else if (cardNumber == 10) {
          hand += ("TH ");
        } else if (cardNumber == 11) {
          hand += ("JH ");
        } else if (cardNumber == 12) {
          hand += ("QH ");
        } else if (cardNumber == 13) {
          hand += ("KH ");
        } else {
          hand += (cardNumber + "H ");
        }
      } else if (cardNumber > 26 && cardNumber <= 39) {
        cardNumber = cardNumber - 26;
        if (cardNumber == 1) {
          hand += ("AD ");
        } else if (cardNumber == 10) {
          hand += ("TD ");
        }  else if (cardNumber == 11) {
          hand += ("JD ");
        } else if (cardNumber == 12) {
          hand += ("QD ");
        } else if (cardNumber == 13) {
          hand += ("KD ");
        } else {
          hand += (cardNumber + "D ");
        }
      } else if (cardNumber > 39 && cardNumber <= 52) {
        cardNumber = cardNumber - 39;
        if (cardNumber == 1) {
          hand += ("AC ");
        } else if (cardNumber == 10) {
          hand += ("TC ");
        }  else if (cardNumber == 11) {
          hand += ("JC ");
        } else if (cardNumber == 12) {
          hand += ("QC ");
        } else if (cardNumber == 13) {
          hand += ("KC ");
        } else {
          hand += (cardNumber + "C ");
        }
      }
    });
    var handScore = getHandScore(hand.trim());
    
    if (handScore == 0) {
      var finalScore = parseInt(localScore) - parseInt(bettingAmount);
      localStorage.setItem("score", finalScore);
      displayScore();
    } else {
      if (handScore == 1) {
        var finalScore = parseInt(localScore);
      } else {
        var finalScore = parseInt(localScore) + parseInt(handScore * bettingAmount);
      }
      localStorage.setItem("score", finalScore);
      displayScore();
    }

  } else {
    alert("Betting Amount shoould not be neither negative nor greater than 10!...");
  }
};

function getHandScore(hand) {
  const ranks = "23456789TJQKA";
  const suits = "CDHS";
  const cards = hand.split(" ");

  // Convert cards to an array of objects with rank and suit properties
  const cardObjects = cards.map(card => {
    return { rank: card[0], suit: card[1] };
  });

  // Sort the cards by rank in descending order
  cardObjects.sort((a, b) => ranks.indexOf(b.rank) - ranks.indexOf(a.rank));

  // Check for royal flush
  if (cardObjects[0].rank === "A" &&
      cardObjects[1].rank === "K" &&
      cardObjects[2].rank === "Q" &&
      cardObjects[3].rank === "J" &&
      cardObjects[4].rank === "T" &&
      cardObjects.every(card => card.suit === cardObjects[0].suit)) {
        $(".royalFlush").addClass("highlight");
    return 10;
  }

  // Check for four of a kind
  if (cardObjects[0].rank === cardObjects[3].rank ||
      cardObjects[1].rank === cardObjects[4].rank) {
        $(".fourKind").addClass("highlight");
    return 8;
  }

  // Check for full house
  if ((cardObjects[0].rank === cardObjects[2].rank && cardObjects[3].rank === cardObjects[4].rank) ||
      (cardObjects[0].rank === cardObjects[1].rank && cardObjects[2].rank === cardObjects[4].rank)) {
        $(".fullHouse").addClass("highlight");
    return 7;
  }

  // Check for flush
  if (cardObjects.every(card => card.suit === cardObjects[0].suit)) {
    $(".flush").addClass("highlight");
    return 5;
  }

  // Check for straight
  if (cardObjects[0].rank === ranks[ranks.indexOf(cardObjects[1].rank) + 1] &&
      cardObjects[1].rank === ranks[ranks.indexOf(cardObjects[2].rank) + 1] &&
      cardObjects[2].rank === ranks[ranks.indexOf(cardObjects[3].rank) + 1] &&
      cardObjects[3].rank === ranks[ranks.indexOf(cardObjects[4].rank) + 1]) {
        $(".straight").addClass("highlight");
    return 5;
  }

  // Check for three of a kind
  if (cardObjects[0].rank === cardObjects[2].rank ||
      cardObjects[1].rank === cardObjects[3].rank ||
      cardObjects[2].rank === cardObjects[4].rank) {
        $(".threeKind").addClass("highlight");
    return 3;
  }

  // Check for two pairs
  if ((cardObjects[0].rank === cardObjects[1].rank && cardObjects[2].rank === cardObjects[3].rank) ||
      (cardObjects[0].rank === cardObjects[1].rank && cardObjects[3].rank === cardObjects[4].rank) ||
      (cardObjects[1].rank === cardObjects[2].rank && cardObjects[3].rank === cardObjects[4].rank)) {
        $(".twoPair").addClass("highlight");
    return 2;
  }

  // Check for pair
  for (let i = 0; i < 4; i++) {
    if (cardObjects[i].rank === cardObjects[i+1].rank) {
      $(".pair").addClass("highlight");
      return 1;
    }
  }

  return 0;

}



