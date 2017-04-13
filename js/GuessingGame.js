function generateWinningNumber() {
    num = Math.random()
    if (num === 0) {
        return 1;
    } else {
      roundNum = Math.floor(num*100);
      return roundNum + 1;
    }
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) {
        return true;
    } else {
        return false;
    }
}

Game.prototype.checkGuess = function() {
    if (this.playersGuess === this.winningNumber) {
        return "You Win!";
    }
    if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return "You have already guessed that number.";
    }

    this.pastGuesses.push(this.playersGuess);

    if (this.pastGuesses.length >= 5) {
        return "You Lose.";
    } else if (this.difference() < 10) {
        return "You're burning up!";
    } else if (this.difference() < 25) {
        return "You're lukewarm.";
    } else if (this.difference() < 50) {
        return "You're a bit chilly.";
    } else {
        return "You're ice cold!";
    }
}

Game.prototype.playersGuessSubmission = function(num) {
    if (num < 1 || num > 100 || typeof num != 'number') {
        throw "That is an invalid guess."
    } else {
        this.playersGuess = num;
        return this.checkGuess();
    }
}

Game.prototype.provideHint = function() {
    return shuffle([generateWinningNumber(), generateWinningNumber(), this.winningNumber]);
}

newGame = function() {
    game = new Game;
    return game;
}






$(document).ready(function() { 
    
    var game = new Game;

    var guessNum

    onSubmit = function(event){
        event.preventDefault();
        var input = $('#player-input');
        var guess = +input.val();
        input.val('');
        var result = game.playersGuessSubmission(guess);
         $('#title').text(result);
        if (result != 'You have already guessed that number.') {
            guessNum = (game.pastGuesses.length - 1).toString();
            var selector = "#l" + guessNum.toString();
            $(selector).text(guess);
        }
        if (result === 'You Win!' || result === 'You Lose.') {
            $('#subtitle').text('Press the reset button to play again.')
            $('#hint').prop('disabled', true)
            $('#submit').prop('disabled', true)
        } else {
            var message
            if (game.isLower()) {
                message = "Guess higher!"
            } else {
                message = "Guess lower!"
            }
            $('#subtitle').text(message);
        }
    };
    
    $('#submit').on('click', function(e){
        onSubmit(e);
    });

    $('#player-input').on('keypress', function(e) {
        if(e.which == 13) {
            e.preventDefault();
            onSubmit(e);
        };
    });

    $('#reset').on('click', function(e) {
        game = new Game;
        $('#title').text("Guessing Game");
        $('#subtitle').text("the best guessing game in the world")
        $('#hint').prop('disabled', false)
        $('#submit').prop('disabled', false)

        var num = 0;
        while (num < 5) {
            $('#l' + num.toString()).text('-')
            num++
        }
    });

    $('#hint').on('click', function(e) {
        var arr = game.provideHint();
        $('#title').text(arr.map(function(x) {return x.toString()}).join(', '))
    })
});


