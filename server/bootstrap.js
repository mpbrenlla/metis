Meteor.startup(function () {

    createIndexesMongoDB();

    Patients.remove({});
    Consultations.remove({});
    AgendaEvents.remove({});

    if (Accounts.findUserByEmail('metis@metis.com') == null) {
        Accounts.createUser({
            username: 'metis',
            email: 'metis@metis.com',
            password: 'metis',
            profile: {
                name: 'Metis'
            }
        });
    }

    var metis = Accounts.findUserByEmail('metis@metis.com');

    if (Patients.find().count() === 0) {

        var patients = [
            {
                name: 'Allen B. Lopez',
                birthdate: new Date(1984, 0, 2),
                location: 'Madrid',
                photo: 'https://deaenij3kiw8r.cloudfront.net/system/users/avatars/141380/original/production-b3612f96cc66fee631be82853dd2c316-man_bartlett_bw.jpg?1369799811',
                public: true
            },
            {
                name: 'Laura B. Red',
                birthdate: new Date(1984, 2, 22),
                location: 'Madrid',
                photo: 'https://meets.com/images/default-avatar.png',
                owner: metis._id
            },
            {
                name: 'Pepe B. Brown',
                birthdate: new Date(1984, 7, 12),
                location: 'Dallas',
                photo: 'https://meets.com/images/default-avatar.png',
                owner: metis._id
            },
            {
                name: 'Robert Drill',
                birthdate: new Date(1980, 7, 12),
                location: 'Boston',
                photo: 'https://meets.com/images/default-avatar.png',
                owner: metis._id
            },
        ];

        patients.forEach(patient => {
                Patients.insert(patient);
            }
        )
        ;


        var consultations = [
            {
                date: new Date(2015, 10, 1),
                observations: 'Consultation 1',
                owner: metis._id
            },
            {
                date: new Date(2015, 9, 15),
                observations: 'Consultation 2',
                owner: metis._id
            },
            {
                date: new Date(2015, 9, 1),
                observations: 'Consultation 3',
                owner: metis._id
            }
        ];

        Patients.find({}).forEach(patient => {
            consultations.forEach(consultation => {
                consultation.patientId = patient._id;
                Consultations.insert(consultation);
            })
        });


        var agendaEvents = [
            {
                start: new Date(2015, 11, 1, 11, 30, 0, 0),
                end: new Date(2015, 11, 1, 12, 00, 0, 0),
                owner: metis._id,
                title: 'Robert Drill',
                patientId: Patients.findOne({name: 'Robert Drill'})._id,
                stick: true
            },

            {
                start: new Date(2015, 11, 2, 9, 30, 0, 0),
                end: new Date(2015, 11, 2, 10, 00, 0, 0),
                owner: metis._id,
                title: 'Pepe B. Brown',
                patientId: Patients.findOne({name: 'Pepe B. Brown'})._id,
                stick: true
            }
        ]

        agendaEvents.forEach(agendaEvent => {
            AgendaEvents.insert(agendaEvent);
        });

    }

    if(Recipes.find().count() === 0) {

        var recipes = [
            {
                fundamentals : {
                    numberOfServings : 2,
                    preparationTimeMinutes : 15,
                    cookingTimeMinutes : 60,
                    rating : 5,
                    tags : [
                        'SPANISH', 'EGGS', 'OMELETTES'
                    ]
                },
                nomenclature : {

                    english : {
                        name : 'SPANISH OMELETTE',
                        desc: 'As simple as it can be..., in each spanish family you will find the omelet tastes different!',
                        steps : [
                            { number: 1, desc: "Scrape the potatoes. Cut them into thick slices. Chop the onion."},
                            { number: 2, desc: "Heat the oil in a large frying pan, add the potatoes and onion and stew gently, partially covered, for 30 minutes, stirring occasionally until the potatoes are softened. Strain the potatoes and onions through a colander into a large bowl (set the strained oil aside)"},
                            { number: 3, desc: "Beat the eggs separately, then stir into the potatoes with the parsley and plenty of salt and pepper. Heat a little of the strained oil in a smaller pan. Tip everything into the pan and cook on a moderate heat, using a spatula to shape the omelette into a cushion"},
                            { number: 4, desc: "When almost set, invert on a plate and slide back into the pan and cook a few more minutes. Invert twice more, cooking the omelette briefly each time and pressing the edges to keep the cushion shape. Slide on to a plate and cool for 10 minutes before serving."}
                        ]
                    },
                    spanish : {

                    }
                },
                ingredients : [
                    { id: 1231, unit: 'grams', amount: 500, name: 'potatoe' },
                    { id: 1234, unit: 'grams', amount: 150, name: 'onion' },
                    { id: 1235, unit: 'ml', amount: 150, name: 'extra-virgin olive oil' },
                    { id: 1236, unit: 'units', amount: 6, name: 'eggs'},
                    { id: 1237, unit: 'x', amount: 0, name: 'salt'}
                ],
                nutrition : {
                    energy: { unit: 'kcal', amount: 516},
                    fat: { unit: 'grams', amount: 43},
                    saturates: { unit: 'grams', amount: 7},
                    protein: {unit: 'grams', amount: 12},
                    carbs: {unit: 'grams', amount: 23},
                    sugars: {unit: 'grams', amount: 0},
                    salt: {unit: 'grams', amount: 0.31}
                }
            }
        ]

        recipes.forEach(recipe => {
                Recipes.insert(recipe);
            }
        )
        ;

    }

})
;

function createIndexesMongoDB() {
    //Ingredients collection
    Ingredients._ensureIndex({'nomenclature.english.shrtDesc': 1});
    Ingredients._ensureIndex({'nomenclature.english.desc': 1});
    Ingredients._ensureIndex({'nomenclature.spanish.desc': 1});
    Ingredients._ensureIndex({'nomenclature.english.foodGroup': 1});
    Ingredients._ensureIndex({'proximates.energKcal.value': 1});
    Ingredients._ensureIndex({'proximates.protein.value': 1});
    Ingredients._ensureIndex({'proximates.lipidTot.value': 1});
    Ingredients._ensureIndex({'proximates.carbohydrt.value': 1});
}