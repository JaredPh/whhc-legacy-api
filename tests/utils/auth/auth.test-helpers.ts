export const mockUserName: string = 'mockUserName';

export const mockRequests = {
    valid: {headers: {authorization: 'Bearer xxx.yyy.zzz'}},
    invalid: {headers: {authorization: 'Bearer xxx.yyy.abc'}},
    incorrect: {headers: {authorization: 'Basic xxx.yyy.zzz'}},
    missing: {},
};
