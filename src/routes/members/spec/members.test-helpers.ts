import Members = Chai.Members;

export const mockMembers: Members[] = [
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
    },
    {
        id: 2,
        userId: null,
        email: null,
        fname: 'Joe',
        lname: 'Blogs',
        roles: [],
    },
    {
        id: 1,
        userId: 'abcdef01-abcd-1234-7890-abcdefabcdef',
        email: 'name2@email.com',
        fname: 'Billy',
        lname: 'Bob',
        roles: [
            { id: 'member', weight: 1 },
        ],
    },
];