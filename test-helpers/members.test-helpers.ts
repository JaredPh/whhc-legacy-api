export const mockMembers = [
    {
        id: 1,
        userId: 'abcdef01-abcd-1234-7890-abcdefabcdef',
        email: 'name1@email.com',
        fname: 'Jane',
        lname: 'Doe',
        roles: [
            { id: 'committee', weight: 3 },
            { id: 'member', weight: 1 },
        ],
        gender: 'M',
        avatar: {
            id: 'someUrl',
            ext: 'jpg',
            description: 'image-description',
            width: 1,
            height: 2,
        },
    },
    {
        id: 2,
        userId: null,
        email: null,
        fname: 'Joe',
        lname: 'Blogs',
        roles: [],
        gender: 'F',
        avatar: {
            id: 'someUrl',
            ext: 'jpg',
            description: 'image-description',
            width: 1,
            height: 2,
        },
    },
    {
        id: 1,
        userId: 'abcdef01-abcd-1234-7890-abcdefabcdef',
        email: 'name2@email.com',
        fname: 'Billy',
        lname: 'Bob',
        gender: 'X',
        roles: [
            { id: 'member', weight: 1 },
        ],
        avatar: null,
    },
];