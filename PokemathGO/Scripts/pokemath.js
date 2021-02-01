
$(function () {
    document.Pokemath = document.Pokemath || {};

    var userSettings;
    var currentAnswer;
    var pokemath = document.Pokemath;
    var allPokemon;
    var currentPokemonIndex;
    var remainingPieces = [];
    var currentPiece;

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function startNewGame() {
        currentPokemonIndex = getRandomIntInclusive(0, allPokemon.length - 1);
        
        while (allPokemon[currentPokemonIndex].evolution && !userSettings.pokedex.hasOwnProperty(allPokemon[currentPokemonIndex].evolution)) {
            currentPokemonIndex = getRandomIntInclusive(0, allPokemon.length - 1);
        }

        $('.picturePart').css('background-image', 'url(images/' + allPokemon[currentPokemonIndex].id + '.png)').addClass('unfound');

        remainingPieces = [];
        for (var i = 0; i < 25; i += 1) {
            remainingPieces.push(i);
        }

        $('.mathProblem').show();    
        $('.btnNext').text('Next Question');

        startNewMathProblem();
    }

    function endGame() {
        //Show the you win message
        $('.mathProblem').hide();
        var id = allPokemon[currentPokemonIndex].id;
        $('#finishDialog .pokemonName').text(allPokemon[currentPokemonIndex].name);
        if (userSettings.pokedex.hasOwnProperty(allPokemon[currentPokemonIndex].id)) {
            userSettings.pokedex[allPokemon[currentPokemonIndex].id].caught += 1; 
            $('#finishDialog .newPokemon').hide();
            $('#finishDialog .oldPokemon').show();
            $('#finishDialog .pokemonCount').text(userSettings.pokedex[allPokemon[currentPokemonIndex].id].caught);
        } else {
            userSettings.pokedex[allPokemon[currentPokemonIndex].id] = { "caught": 1 };
            $('#finishDialog .newPokemon').show();
            $('#finishDialog .oldPokemon').hide();
        }

        $('.newPokedexLink').attr('href', 'pokedex.html?' + allPokemon[currentPokemonIndex].id);

        pokemath.saveSettings(userSettings);

        //If the pokemon is legendary, show the legendary text
        $('.legendary').toggle(id === "144" || id === "145" || id === "146" || id === "150" || id === "151" || id == "243" || id === "244" || id === "245" || id === "249" || id === "250" || id === "251");

        $('#finishDialog').modal('show');
    }

    function startNewMathProblem() {
        var operator = userSettings.operations[getRandomIntInclusive(0, userSettings.operations.length - 1)];
        var num1;
        var num2;
        var temp;
        var nextPieceIndex;
        var operatorDisplay;

        $('#txtAnswer').val('').focus();

        $('.btnNext').attr('disabled', 'disabled');
        $('.answerGroup').removeClass('has-success').addClass('has-error');

        if (remainingPieces.length < 1) {
            endGame();
            return;
        }

        if (operator === '*' || operator === '/') {
            num1 = getRandomIntInclusive(userSettings.multMin, userSettings.multMax);
            num2 = getRandomIntInclusive(userSettings.multMin, userSettings.multMax);

            if (operator === '/') {
                operatorDisplay = '÷';
                currentAnswer = num1;
                num1 = currentAnswer * num2;
            } else {
                currentAnswer = num1 * num2;
                operatorDisplay = 'X';
            }
        } else {
            operatorDisplay = operator;
            num1 = getRandomIntInclusive(userSettings.addMin, userSettings.addMax);
            num2 = getRandomIntInclusive(userSettings.addMin, userSettings.addMax);

            if (operator === '+') {
                currentAnswer = num1 + num2;
            } else {
                //We want num1 > num2
                if (num2 > num1) {
                    temp = num1;
                    num1 = num2;
                    num2 = temp;
                }

                currentAnswer = num1 - num2;
            }
        }

        $('.number1').text(num1);
        $('.number2').text(num2);
        $('.operator').text(operatorDisplay);

        //Show a hidden piece
        nextPieceIndex = getRandomIntInclusive(0, remainingPieces.length - 1);
        currentPiece = remainingPieces[nextPieceIndex];
        remainingPieces.splice(nextPieceIndex, 1);
        $('.picturePreview').removeClass().addClass('picturePreview picturePart picturePart' + currentPiece);

        if (remainingPieces.length < 1) {
            $('.btnNext').text('Finish!');
        }
    }

    function onKeyUp(event) {

        //btnNext.Enabled = false;
        //currentPicture.Visible = false;
        var userAnswer = $('#txtAnswer').val();

        if (userAnswer == currentAnswer) {
            $('.answerGroup').removeClass('has-error').addClass('has-success');
            $('.btnNext').removeAttr('disabled');
            $('.wholePicture .picturePart' + currentPiece).removeClass('unfound').addClass('visible');

            if (event.which === 13) {
                startNewMathProblem();
            }
        }
        else {
            $('.btnNext').attr('disabled', 'disabled');
            $('.answerGroup').removeClass('has-success').addClass('has-error');
            $('.wholePicture .picturePart' + currentPiece).removeClass('visible').addClass('unfound');
        }

    }

    userSettings = pokemath.getSettings();
    $('.startGame').click(startNewGame);
    $('#txtAnswer').keyup(onKeyUp);
    $('.btnNext').click(function () {
        if ($(this).attr('disabled')) {
            return;
        }
        startNewMathProblem();
    });
    $.getJSON('pokemon.json', function (data) {
        allPokemon = data;
    });
});
    
