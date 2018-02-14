export class MockDataService {
    private clubs = [
        { id:   1,  name: 'Alpha' },
        { id:   3,  name: 'Beta' },
        { id:   17, name: 'Charlie' },
        { id:  199, name: 'Delta' },
        { id: 1001, name: 'Echo' },
        { id:  121, name: 'Foxtrot' },
        { id:    2, name: 'Golf' },
        { id:    4, name: 'Hotel' },
        { id:   76, name: 'Indigo' },
        { id:   13, name: 'Juliet' },
    ];

    private teams = [
      { id: 99, name: 'M1' },
      { id: 42, name: 'M2' },
      { id: 63, name: 'M3' },
      { id: 54, name: 'M4' },
      { id: 35, name: 'Wasps' },
      { id: 29, name: 'L1' },
      { id: 10, name: 'L2' },
      { id: 11, name: 'L3' },
      { id: 12, name: 'L4' },
      { id: 13, name: 'Medics' },
    ];

    private locations = [
        { id: 11, name: 'The Moon', address: 'Night Sky', town: 'Space', postcode: 'M0 00N' },
        { id: 12, name: 'Buckingham Palace', address: 'Pall Mall', town: 'London', postcode: 'SW1A 1AA' },
        { id: 13, name: 'Olympic Park', address: null, town: 'London', postcode: 'E20 2ST' },
    ];

  getClubs(count?: number) {
    let clubs = this.clubs.map((c, i) => {
        c.teams = this.getSlice(this.teams, i);
        c.locations = this.getSlice(this.locations, i);
        return c;
    });

    if (count) clubs = clubs.slice(0, count);
    return clubs;
  }

  private getSlice(array: T[], index: number): T[] {
    return array.slice(0, index % array.length + 1);
  }
}
