import { v4 as uuidv4 } from 'uuid';

const featuredDeals = [
    {
        id: uuidv4(),
        image: 'https://main-cdn.grabone.co.nz/goimage/325x225/01915fca4b34589ed7eb907427601fbe5136da09.jpg',
        title: 'Day Pass Combo incl. Rental Equipment',
        activity: 'Snowplanet',
        place: 'Silverdale',
        rate: 4,
        oldPrice: '$124',
        price: "$45",
        description: 'Day Pass Combo to Snowplanet incl. Rental Equipment'
    },
    {
        id: uuidv4(),
        image: 'https://main-cdn.grabone.co.nz/goimage/325x225/985d76296598c852a5f1b16142cfa7d020d9d135.jpg',
        title: 'Day Tandem Skydive Package Combo incl. Rental Equipment',
        activity: 'Taupo Tandem Skydiving',
        place: 'Taupo',
        rate: 4.5,
        oldPrice: null,
        price: "$199",
        description: '9000ft Tandem Skydive Package Overlooking Lake Taupo - Options for 12000ft, 15000ft or 18500ft & to incl. Voucher Towards a Camera Package or Exit Image - Valid from 1st January 2022'
    },
    {
        id: uuidv4(),
        image: 'https://main-cdn.grabone.co.nz/goimage/325x225/f02832bceeb5c708ea36ca003065305d1c1ddbcd.jpg',
        title: 'Six-Course Signature Menu Dining Experience',
        activity: 'Sails Restaurant, Westhaven Marina',
        place: 'Auckland',
        rate: 4.7,
        oldPrice: null,
        price: "$89",
        description: 'Six-Course Signature Menu Dining Experience - Options for up to Ten People - Valid from 5th January 2022'
    },
    {
        id: uuidv4(),
        image: 'https://main-cdn.grabone.co.nz/goimage/325x225/7a54d766b8a20a9b6efe7c02c6a2e289b3328b60.jpg',
        title: ' Water Sports Experience',
        activity: 'Vector Wero Whitewater Park',
        place: 'Wiri',
        rate: 5,
        oldPrice: '$74',
        price: "$39",
        description: 'Rafting & Lake Adventure Combo incl. Ice Cream for One Person - Options for up to Seven People'
    },
];

export default featuredDeals;