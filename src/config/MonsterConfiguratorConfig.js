export class MonsterConfiguratorConfig {
    /***
     * Get configuration for monster configurator
     * @returns ({})
     */
    static get getConfig() {
        return [
            {
                type: 'text',
                name: 'name',
                label: 'Name',
                validator: {
                    validate: (value) => {
                        return value !== null && value !== '';
                    },
                    error: 'Please enter a monster name'
                }
            },
            {
                type: 'select',
                name: 'type',
                label: 'Elemental type',
                options: [
                    {
                        label: 'Water',
                        value: 'water'
                    },
                    {
                        label: 'Fire',
                        value: 'fire'
                    },
                    {
                        label: 'Earth',
                        value: 'earth'
                    },
                    {
                        label: 'Wind',
                        value: 'wind'
                    }
                ],
                updatePreview: true
            },
            {
                type: 'select',
                name: 'color',
                label: 'Color',
                options: [
                    {
                        label: 'Blue',
                        value: 'blue'
                    },
                    {
                        label: 'Red',
                        value: 'red'
                    },
                    {
                        label: 'Green',
                        value: 'green'
                    }
                ]
            },
            {
                type: 'select',
                name: 'arms',
                label: 'Amount of arms',
                options: [
                    {
                        label: '2',
                        value: 2
                    },
                    {
                        label: '4',
                        value: 4,
                        condition: [{type: ['water', 'fire']}]
                    },
                    {
                        label: '6',
                        value: 6,
                        condition: [{type: ['water', 'fire']}]
                    },
                    {
                        label: '8',
                        value: 8,
                        condition: [{type: 'water'}]
                    }
                ],
                converter: (value) => {
                    return parseInt(value);
                }
            },
            {
                type: 'select',
                name: 'armType',
                label: 'Arm type',
                options: [
                    {
                        label: 'Tentacles',
                        value: 'tentacles',
                        condition: [{type: ['water', 'fire']}]
                    },
                    {
                        label: 'Fins',
                        value: 'fins',
                        condition: [{type: 'water'}]
                    },
                    {
                        label: 'Claws',
                        value: 'claws',
                        condition: [{type: ['earth', 'fire']}]
                    },
                    {
                        label: 'Clawed wings',
                        value: 'clawed-wings',
                        condition: [{type: ['wind', 'fire']}]
                    },
                    {
                        label: 'Wings',
                        value: 'wings',
                        condition: [{type: 'wind'}]
                    }
                ]
            },
            {
                type: 'select',
                name: 'legs',
                label: 'Amount of legs',
                options: [
                    {
                        label: '0 Legs',
                        value: 0,
                        condition: [{type: ['water', 'fire', 'wind']}]
                    },
                    {
                        label: '2 Legs',
                        value: 2,
                        condition: [
                            {type: 'water', arms: [2, 4]},
                            {type: 'fire', arms: 2},
                            {type: ['wind', 'earth']}
                        ]
                    },
                    {
                        label: '4 Legs',
                        value: 4,
                        condition: [
                            {type: 'water', arms: [2, 4]},
                            {type: 'earth'}
                        ]
                    },
                    {
                        label: '6 Legs',
                        value: 6,
                        condition: [{type: 'earth'}]
                    }
                ],
                converter: (value) => {
                    return parseInt(value);
                }
            },
            {
                type: 'select',
                name: 'eyes',
                label: 'Amount of eyes',
                options: [
                    {
                        label: '0 eyes',
                        value: 0,
                        condition: [{type: ['water', 'fire']}]
                    },
                    {
                        label: '2 eyes',
                        value: 2,
                        condition: [{type: ['water', 'earth', 'fire', 'wind']}]
                    },
                    {
                        label: '4 eyes',
                        value: 4,
                        condition: [{type: ['water', 'fire']}]
                    },
                    {
                        label: '6 eyes',
                        value: 6,
                        condition: [{type: 'water'}]
                    },
                    {
                        label: '8 eyes',
                        value: 8,
                        condition: [{type: 'water'}]
                    }
                ],
                converter: (value) => {
                    return parseInt(value);
                }
            },
            {
                type: 'select',
                name: 'fur',
                label: 'Type of fur',
                options: [
                    {
                        label: 'Scales',
                        value: 'scales',
                        condition: [{type: ['water', 'fire', 'earth', 'wind']}]
                    },
                    {
                        label: 'Slime',
                        value: 'slime',
                        condition: [{type: ['water', 'earth']}]
                    },
                    {
                        label: 'Feathers',
                        value: 'feathers',
                        condition: [{type: ['fire', 'wind']}]
                    },
                    {
                        label: 'Hair',
                        value: 'hair',
                        condition: [{type: ['earth', 'wind']}]
                    }
                ]
            },
            {
                type: 'radio',
                name: 'canSwim',
                label: 'Can swim',
                options: [
                    {
                        label: 'Yes',
                        value: true,
                        condition: [
                            { type: ['water'] },
                            { type: ['wind'], fur : ['scales'] }
                        ]
                    },
                    {
                        label: 'No',
                        value: false,
                        condition: [
                            { type: ['earth', 'wind', 'fire'] }
                        ]
                    }
                ],
                converter: (value) => {
                    if(value === 'true') {
                        return true;
                    }
                    if(value === 'false') {
                        return false;
                    }
                    return null;
                },
                validator: {
                    validate: (value) => {
                        return value === true ||  value === false;
                    },
                    error: 'Please enter if monster can swim'
                }
            },
            {
                type: 'radio',
                name: 'canFly',
                label: 'Can fly',
                options: [
                    {
                        label: 'Yes',
                        value: true,
                        condition: [
                            {type: 'wind'},
                            {type: 'fire', fur: 'feathers'}
                        ]
                    },
                    {
                        label: 'No',
                        value: false,
                        condition: [{type: ['water', 'earth', 'fire']}]
                    }
                ],
                converter: (value) => {
                    if(value === 'true') {
                        return true;
                    }
                    if(value === 'false') {
                        return false;
                    }
                    return null;
                },
                validator: {
                    validate: (value) => {
                        return value === true ||  value === false;
                    },
                    error: 'Please enter if monster can fly'
                }
            }
        ];
    }
}
