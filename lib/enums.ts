export function getStates(): { name: string, index: number }[] {
    const states: { name: string, index: number }[] =
        [
            {
                name: "Alabama",
                index: 1,
            },
            {
                name: "Alaska",
                index: 2,
            },
            {
                name: "Arizona",
                index: 3,
            },
            {
                name: "Arkansas",
                index: 4,
            },
            {
                name: "California",
                index: 5,
            },
            {
                name: "Colorado",
                index: 6,
            },
            {
                name: "Connecticut",
                index: 7,
            },
            {
                name: "Delaware",
                index: 8,
            },
            {
                name: "Florida",
                index: 9,
            },
            {
                name: "Georgia",
                index: 10,
            },
            {
                name: "Hawaii",
                index: 11,
            },
            {
                name: "Idaho",
                index: 12,
            },
            {
                name: "Illinois",
                index: 13,
            },
            {
                name: "Indiana",
                index: 14,
            },
            {
                name: "Iowa",
                index: 15,
            },
            {
                name: "Kansas",
                index: 16,
            },
            {
                name: "Kentucky",
                index: 17,
            },
            {
                name: "Louisiana",
                index: 18,
            },
            {
                name: "Maine",
                index: 19,
            },
            {
                name: "Maryland",
                index: 20,
            },
            {
                name: "Massachusetts",
                index: 21,
            },
            {
                name: "Michigan",
                index: 22,
            },
            {
                name: "Minnesota",
                index: 23,
            },
            {
                name: "Mississippi",
                index: 24,
            },
            {
                name: "Missouri",
                index: 25,
            },
            {
                name: "Montana",
                index: 26,
            },
            {
                name: "Nebraska",
                index: 27,
            },
            {
                name: "Nevada",
                index: 28,
            },
            {
                name: "New Hampshire",
                index: 29,
            },
            {
                name: "New Jersey",
                index: 30,
            },
            {
                name: "New Mexico",
                index: 31,
            },
            {
                name: "New York",
                index: 32,
            },
            {
                name: "North Carolina",
                index: 33,
            },
            {
                name: "North Dakota",
                index: 34,
            },
            {
                name: "Ohio",
                index: 35,
            },
            {
                name: "Oklahoma",
                index: 36,
            },
            {
                name: "Oregon",
                index: 37,
            },
            {
                name: "Pennslyvania",
                index: 38,
            },
            {
                name: "Rhode Island",
                index: 39,
            },
            {
                name: "South Carolina",
                index: 40,
            },
            {
                name: "South Dakota",
                index: 41,
            },
            {
                name: "Tennessee",
                index: 42,
            },
            {
                name: "Texas",
                index: 43,
            },
            {
                name: "Utah",
                index: 44,
            },
            {
                name: "Vermont",
                index: 45,
            },
            {
                name: "Virginia",
                index: 46,
            },
            {
                name: "Washington",
                index: 47,
            },
            {
                name: "West Virginia",
                index: 48,
            },
            {
                name: "Wisconsin",
                index: 49,
            },
            {
                name: "Wyoming",
                index: 50,
            }
        ]
    return states
}


/*
 'Algeria',
    'Angola',
    'Benin',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cameroon',
    'Central African Republic',
    'Chad',
    'Comoros',
    'Democratic Republic of the Congo',
    'Republic of Congo',
    'Djibouti',
    'Egypt',
    'Equatorial Guinea',
    'Eritrea',
    'Eswatini',
    'Ethiopia',
    'Gabon',
    'Gambia',
    'Guinea',
    'Guinea-Bissau',
    'Ivory Coast',
    'Liberia',
    'Libya',
    'Madagascar',
    'Mali',
    'Mauritania',
    'Mauritius',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Niger',
    'Nigeria',
    'Rwanda',
    'Sao Tome and Principe',
    'Senegal',
    'Seychelles',
    'Sierra Leone',
    'Somalia',
    'South Sudan',
    'Sudan',
    'Tanzania',
    'Togo',
    'Tunisia',
    'Zambia',
    'Zimbabwe',
*/
export const africanCountries: string[] = [
   
    'Botswana',
    
    'Ghana',
    
    'Kenya',
    'Lesotho',
    
    'Malawi',
    
    'South Africa',
    
    'Uganda',
    
  ];
  

  export enum BookDriveStatus {
    Active = 0,
    Verifying = 1,
    Completed = 2,
    Cancelled = 3,
}

export const statusMap = new Map<number, string>([
    [0, "Active"],
    [1, "Verifying"],
    [2, "Completed"],
    [3, "Cancelled"]
])

export const deadlineMap = new Map<string, Date>([
    ['South Africa', new Date()],
    ['Democratic Republic of the Congo', new Date()],
    ['Malawi', new Date()]
])