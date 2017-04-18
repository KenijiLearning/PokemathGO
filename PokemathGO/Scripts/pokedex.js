$(function () {
    
    $.getJSON('pokemon.json', function (allPokemon) {
        var userSettings = document.Pokemath.getSettings();
        var container = $('.pokedex');

        $.each(allPokemon, function (index, pokemon) {
            var entry = $('<div>').addClass('pokedexEntry').attr('id', 'p' + pokemon.id);
            var picture = $('<div>').addClass('pokedexPicture');
            var span = $('<h3>');
            var catchCount = userSettings.pokedex[pokemon.id] ? userSettings.pokedex[pokemon.id].caught : 0;

            if (catchCount) {
                span.text(pokemon.name);
                picture.css('background-image', 'url(images/' + pokemon.id + '.png)');
            } else {
                span.html('???');
            }

            entry.append(span);
            entry.append(picture);
            
            span = $('<h4>').text(pokemon.id).addClass('pokemonId');
            entry.append(span);

            if (catchCount) {
                span = $('<h4>').text('Caught: ' + catchCount);
                entry.append(span);
            }

            container.append(entry);
        });

        if (location.search && $('#p' + location.search.substr(1)).length) {
            $('#p' + location.search.substr(1))[0].scrollIntoView(true);
        }
    });
});