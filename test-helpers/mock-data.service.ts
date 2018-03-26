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

    private games = [
        { id: 8, date: '2018-02-03', time: '12:00:00', format: 'league', status: 'result', score: { home: 2, away: 1 } },
        { id: 6, date: '2016-02-03', time: '12:00:00', format: 'league', status: 'result', score: { home: 1, away: 1 } },
        { id: 4, date: '2017-02-03', time: '12:00:00', format: 'league', status: 'result', score: { home: 0, away: 1 } },
        { id: 2, date: '2014-02-03', time: '12:00:00', format: 'league', status: 'result', score: { home: 9, away: 8 } },
        { id: 1, date: '2013-02-03', time: '12:00:00', format: 'league', status: 'result', score: { home: 2, away: 1 } },
        { id: 3, date: '2000-02-03', time: '12:00:00', format: 'league', status: 'postponed' },
        { id: 3, date: '2000-02-03', time: '12:00:00', format: 'league', status: 'cancelled' },
        { id: 5, date: '2019-02-03', time: '12:00:00', format: 'league', status: 'sheduled' },
        { id: 7, date: '2011-02-03', time: '12:00:00', format: 'league', status: 'sheduled' },
        { id: 9, date: '2011-02-03', time: '12:00:00', format: 'league', status: 'sheduled' },
    ];

    public getClubs(count?: number) {
        let clubs = this.clubs.map((c, i) => {
            c.teams = this.getSlice(this.teams, i);
            c.locations = this.getSlice(this.locations, i);
            return c;
        });

        if (count) clubs = clubs.slice(0, count);

        return clubs;
    }

    public getTeams(count?: number) {
        let teams = this.teams.map((t) => {
            t.club = this.clubs.sort(() => Math.random() - 0.5)[0];
            t.homeGames = this.getGames(5);
            t.awayGames = this.getGames(3);
            return t;
        });

        if (count) teams = teams.slice(0, count);

        return teams;
    }

    public getLocations(count?: number) {
        let locations = this.locations.map((l, i) => {
            l.clubs = this.getSlice(this.locations, i);
            return l;
        });

        if (count) locations = locations.slice(0, count);

        return locations;
    }

    public getGames(count?: number) {

        let games = this.games.map((g) => {
            const clubs = this.clubs
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);

            const teams = this.teams
                .sort(() => Math.random() - 0.5)
                .slice(0, 2)
                .map((t, i) => {
                    t.club = clubs[i];
                    return t;
                });

            g.homeTeam = teams[0];
            g.awayTeam = teams[1];

            g.location = this.locations.sort(() => Math.random() - 0.5)[0];

            return g;
        });

        if (count) games = games.slice(0, count);

        return games;
    }

    private getSlice(array: T[], index: number): T[] {
        return array.slice(0, index % array.length + 1);
    }
}
