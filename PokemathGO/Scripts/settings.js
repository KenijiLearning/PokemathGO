$(function () {
    document.Pokemath = document.Pokemath || {};
    var pokemath = document.Pokemath;
    var userSettings;

    pokemath.getSettings = function () {
        var savedSettings = localStorage.getItem('pokemathSettings');
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
        return {
            "operations": ['+'],
            "addMin": 5,
            "addMax": 50,
            "multMin": 2,
            "multMax": 12,
            "pokedex": {}
        };

    };

    pokemath.saveSettings = function (newSettings) {
        localStorage.setItem("pokemathSettings", JSON.stringify(newSettings));
    };

    if ($('.settingsForm').length) {

        userSettings = pokemath.getSettings();

        $('#chkAdd').prop('checked', userSettings.operations.indexOf('+') >= 0);
        $('#chkSub').prop('checked', userSettings.operations.indexOf('-') >= 0);
        $('#chkMult').prop('checked', userSettings.operations.indexOf('*') >= 0);
        $('#chkDiv').prop('checked', userSettings.operations.indexOf('/') >= 0);

        $('.addMin').val(userSettings.addMin);
        $('.addMax').val(userSettings.addMax);
        $('.multMin').val(userSettings.multMin);
        $('.multMax').val(userSettings.multMax);

        $('.btnSubmit').click(function () {
            var min, max;

            if (!$('.operatorsGroup input:checked').length) {
                $('.operatorsGroup').addClass('has-error');
                return;
            }
            $('.operatorsGroup').removeClass('has-error');

            min = parseInt($('.addMin').val());
            max = parseInt($('.addMax').val());

            if (isNaN(min) || isNaN(max) || min > max) {
                $('.addGroup').addClass('has-error');
                return;
            }
            $('.addGroup').removeClass('has-error');

            min = parseInt($('.multMin').val());
            max = parseInt($('.multMax').val());

            if (isNaN(min) || isNaN(max) || min > max) {
                $('.multGroup').addClass('has-error');
                return;
            }
            $('.multGroup').removeClass('has-error');

            userSettings.operations = [];
            if ($('#chkAdd').prop('checked')) {
                userSettings.operations.push('+');
            }
            if ($('#chkSub').prop('checked')) {
                userSettings.operations.push('-');
            }
            if ($('#chkMult').prop('checked')) {
                userSettings.operations.push('*');
            }
            if ($('#chkDiv').prop('checked')) {
                userSettings.operations.push('/');
            }
            userSettings.addMin = parseInt($('.addMin').val());
            userSettings.addMax = parseInt($('.addMax').val());
            userSettings.multMin = parseInt($('.multMin').val());
            userSettings.multMax = parseInt($('.multMax').val());

            pokemath.saveSettings(userSettings);
            $('#saveMessage').modal('show');
        });
    }

});