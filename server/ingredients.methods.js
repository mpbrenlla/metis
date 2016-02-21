Meteor.publish("ingredients", function (options,searchString, groupFood, language, onlyActive) {

    if (searchString == null) {
        searchString = '';
    }

    let query = {};
    if(language == 'spanish') {
        query = {
            'nomenclature.spanish.desc' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' }
        };
    } else {
        query = {
            'nomenclature.english.desc' : { '$regex' : '.*' + searchString || '' + '.*', '$options' : 'i' }
        };
    }

    if (groupFood !== null && groupFood !== '') {
        query['nomenclature.english.foodGroup'] = groupFood;
    }

    if (onlyActive) {
        query['active'] = true;
    }

    if (options == null || options.limit == null || options.limit > 15) {
        console.log(options);
        options.limit=8;
    }

    Counts.publish(this, 'numberOfIngredients', Ingredients.find(query),
        { noReady: true });

    console.log(query);
    return Ingredients.find(query,options);
});

Meteor.publish("ingredient-details", function (idToSearch) {
    return Ingredients.find({
        '_id' : idToSearch
    });
});

Meteor.publish("recipe-ingredients", function (options, recipeIngredients) {

    console.log('In publish method, with next data: ' + recipeIngredients);

    var sub = this;
    var subHandle = null;

    subHandle = Ingredients.find({
        'ndbNo' : {$in: recipeIngredients}
    }, options)
        .observeChanges({
            added: function(id, fields) {
                sub.added("ingredientsRecipe", id, fields);
            },
            changed: function(id, fields) {
                sub.changed("ingredientsRecipe", id, fields);
            },
            removed: function(id) {
                sub.removed("ingredientsRecipe", id);
            }
        });

    sub.ready();

    sub.onStop(function() {
        subHandle.stop();
    })
});

Meteor.methods({

    checkIngredients : function () {
        console.log('checking ingredients');
        return Ingredients.find().count()>0?true:false;
    },

    loadIngredients : function () {
        var ingredients=[];
        var allJson = Assets.getText('abbrv/all.json');
        console.log('read');
        ingredients = allJson.split('|||');

        _.each(ingredients, function (ingredient) {
            Ingredients.insert(JSON.parse(ingredient));
            console.log('ingredient inserted');
        });
        return true;
    },

    updateIngredient : function (ingredient) {
        console.log('[server] updateIngredient');
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        if (ingredient._id) {
            Ingredients.update(
                {'_id': ingredient._id},
                ingredient
            );
            console.log("Ingredient updated");
        }
    }

})