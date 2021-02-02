$(function () {

    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
    var userSettings = document.Pokemath.getSettings();

    $.getJSON('pokemon.json', function (allPokemon) {
        
        var container = $('.pokedex');
        var query = location.search;
        var i;
        var newPokedex = {};

        //If the query starts with load=, then we need to load some user settings.
        if (query) 
        {
            query = query.substr(1);
            if (query.indexOf('load=') === 0) {
                query = query.substr(5);
                query = Base64.decode(query);
                query = query.split(':');
                for (i = 0; i < query.length; i += 2) {
                    newPokedex[query[i]] = { "caught": +query[i + 1] };
                }
                query = undefined;
                userSettings.pokedex = newPokedex;
                document.Pokemath.saveSettings(userSettings);
            }
        }

        $.each(allPokemon, function (index, pokemon) {
            var entry = $('<div>').addClass('pokedexEntry').attr('id', 'p' + pokemon.id);
            var picture = $('<div>').addClass('pokedexPicture');
            var span = $('<h3>');
            var catchCount = userSettings.pokedex[pokemon.id] ? userSettings.pokedex[pokemon.id].caught : 0;

            if (pokemon.premium) {
                picture.addClass("premium");
            }

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

        if (query && $('#p' + query).length) {
            $('#p' + query)[0].scrollIntoView(true);
        }
    });

    $('.btnSave').click(function () {
        //Create a string like id:caught:id:caught
        var storage = '';
        $.each(userSettings.pokedex, function (id, caught) {
            storage += ':' + id + ':' + caught.caught;
        });
        var url = [location.protocol, '//', location.host, location.pathname].join('');
        url += '?load=' + Base64.encode(storage.substr(1));
        $('#pokedexLink').val(url);
        $('#saveMessage').modal('show');
    });

});