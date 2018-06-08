import { Test } from '@nestjs/testing';

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { SinonStub } from 'sinon';

import * as superagent from 'superagent';

import { GoogleMapsService } from './google-maps.service';
import { mockLocations } from '../../routes/locations/locations.test-helpers';
import { LocationResult } from '../../routes/locations/locations.models';
import { GoogleMapImage } from './google.interfaces';
import { mockGoogleMapResult, mockGoogleMapWithTrafficResult, mockGoogleMapwithZeroResult } from './google-maps.test-helpers';
import {LocationDrivingResult, LocationTransitResult} from '../../routes/locations/locations.interfaces';

chai.use(sinonChai);

const expect = chai.expect;

describe('GoogleMapsService', () => {
    let googleMapsService: GoogleMapsService;

    before( async () => {

        const module = await Test.createTestingModule({
            components: [
                GoogleMapsService,
            ],
        }).compile();

        googleMapsService = module.get<GoogleMapsService>(GoogleMapsService);
    });

    describe('getDrivingTime()', () => {
        describe('succesfull call with no start time', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : mockGoogleMapResult,
                            }),
                        };
                    },
                });

                result = await googleMapsService.getDrivingTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should add the address to the request', () => {
                expect(params.destinations).to.equal(mockLocations[0].address);
            });

            it('should not add the traffic_model to the request', () => {
                expect(params.traffic_model).to.be.undefined;
            });

            it('should not add the departure_time to the request', () => {
                expect(params.departure_time).to.be.undefined;
            });

            it('should call superagent get method', () => {
                expect(superagentStub).to.have.been.called;
            });

            it('should resolve to be have the keys [\'distance\', \'time\']', () => {
                expect(result).to.have.keys(['distance', 'time']);
            });
        });

        describe('succesfull call with start time', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : mockGoogleMapWithTrafficResult,
                            }),
                        };
                    },
                });

                result = await googleMapsService.getDrivingTime(new LocationResult(mockLocations[0]), new Date().toJSON());
            });

            after(() => {
                superagentStub.restore();
            });

            it('should add the address to the request', () => {
                expect(params.destinations).to.equal(mockLocations[0].address);
            });

            it('should add the traffic_model to the request', () => {
                expect(params.traffic_model).to.equal('pessimistic');
            });

            it('should add the departure_time to the request', () => {
                expect(params.departure_time).to.be.a('number');
            });

            it('should call superagent get method', () => {
                expect(superagentStub).to.have.been.called;
            });

            it('should resolve to be have the keys [\'distance\', \'time\', \'traffic\']', () => {
                expect(result).to.have.keys(['distance', 'time', 'traffic']);
            });
        });

        describe('succesfull call with no results', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : mockGoogleMapwithZeroResult,
                            }),
                        };
                    },
                });

                result = await googleMapsService.getDrivingTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should resolve to be null', () => {
                expect(result).to.be.null;
            });
        });

        describe('succesfull call with bad status', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : { status: 'ERROR '},
                            }),
                        };
                    },
                });

                result = await googleMapsService.getDrivingTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should resolve to be null', () => {
                expect(result).to.be.null;
            });
        });

        describe('succesfull call with an error', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(new Error(), null),
                        };
                    },
                });

                result = await googleMapsService.getDrivingTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should resolve to be null', () => {
                expect(result).to.be.null;
            });
        });
    });

    describe('getTransitTime()', () => {
        describe('succesfull call with no start time', () => {
            let result: LocationTransitResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : mockGoogleMapWithTrafficResult,
                            }),
                        };
                    },
                });

                result = await googleMapsService.getTransitTime(new LocationResult(mockLocations[0]),);
            });

            after(() => {
                superagentStub.restore();
            });

            it('should add the address to the request', () => {
                expect(params.destinations).to.equal(mockLocations[0].address);
            });

            it('should call superagent get method', () => {
                expect(superagentStub).to.have.been.called;
            });

            it('should resolve to be have the keys [\'time\']', () => {
                expect(result).to.have.keys(['time']);
            });
        });

        describe('succesfull call with start time', () => {
            let result: LocationTransitResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : mockGoogleMapWithTrafficResult,
                            }),
                        };
                    },
                });

                result = await googleMapsService.getTransitTime(new LocationResult(mockLocations[0]), new Date().toJSON());
            });

            after(() => {
                superagentStub.restore();
            });

            it('should add the address to the request', () => {
                expect(params.destinations).to.equal(mockLocations[0].address);
            });

            it('should add the arrival_time to the request', () => {
                expect(params.arrival_time).to.be.a('number');
            });

            it('should call superagent get method', () => {
                expect(superagentStub).to.have.been.called;
            });

            it('should resolve to be have the keys [\'time\']', () => {
                expect(result).to.have.keys(['time']);
            });
        });

        describe('succesfull call with no results', () => {
            let result: LocationTransitResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : mockGoogleMapwithZeroResult,
                            }),
                        };
                    },
                });

                result = await googleMapsService.getTransitTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should resolve to be null', () => {
                expect(result).to.be.null;
            });
        });

        describe('succesfull call with bad status', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(null, {
                                body : { status: 'ERROR '},
                            }),
                        };
                    },
                });

                result = await googleMapsService.getTransitTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should resolve to be null', () => {
                expect(result).to.be.null;
            });
        });

        describe('succesfull call with an error', () => {
            let result: LocationDrivingResult;
            let params;
            let superagentStub: SinonStub;

            before(async () => {
                superagentStub = sinon.stub(superagent, 'get').returns({
                    query: (p) => {
                        params = p;
                        return {
                            end: (callback) => callback(new Error(), null),
                        };
                    },
                });

                result = await googleMapsService.getTransitTime(new LocationResult(mockLocations[0]));
            });

            after(() => {
                superagentStub.restore();
            });

            it('should resolve to be null', () => {
                expect(result).to.be.null;
            });
        });
    });

    describe('getMap()', () => {
        let result: GoogleMapImage;

        before(() => {
            result = googleMapsService.getMap(new LocationResult(mockLocations[0]));
        });

        it('should return an object with keys [\'image\', \'url\']', () => {
            expect(result).to.have.keys(['image', 'url']);
        });

        it('should return an image object with keys [\'url\', \'description\', \'width\', \'height\']', () => {
            expect(result.image).to.have.keys(['url', 'description', 'width', 'height']);
        });
    });
});
