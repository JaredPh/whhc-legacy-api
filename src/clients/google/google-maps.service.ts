import { Component } from '@nestjs/common';
import * as request from 'superagent';
import * as moment from 'moment';

import { GoogleDistanceRequest } from './google.models';

import { LocationResult } from '../../routes/locations/locations.models';
import { LocationDrivingResult, LocationTransitResult } from '../../routes/locations/locations.interfaces';

@Component()
export class GoogleMapsService {

    constructor() {}

    public getDrivingTime(location: LocationResult, start?: string): Promise<LocationDrivingResult> {
        return new Promise((resolve) => {
            const query: GoogleDistanceRequest = {
                key: process.env.GOOGLE_DISTANCE_APIKEY,
                destinations: location.address,
                language: 'en',
                mode: 'driving',
                origins: 'NW6+1HZ',
                units: 'imperial',
            };

            if (start) {
                query.traffic_model = 'pessimistic';
                query.departure_time = Math.max(moment().unix(), moment(start).subtract(2, 'hours').unix());
            }

            request
                .get('https://maps.googleapis.com/maps/api/distancematrix/json')
                .query(query)
                .end((err, res) => {
                    if (err || res.body.status !== 'OK') {
                        resolve(null);
                    } else {
                        const element = res.body.rows[0].elements[0];

                        if (element.status && element.status === 'ZERO_RESULTS') {
                            resolve();
                        } else if (element.duration_in_traffic) {
                            resolve({
                                distance: Math.round(element.distance.value / 1609),
                                time: element.duration.value,
                                traffic: element.duration_in_traffic.value - element.duration.value,
                            });
                        } else {
                            resolve({
                                distance: Math.round(element.distance.value / 1609),
                                time: element.duration.value,
                            });
                        }
                    }
                });
        });
    }

    public getTransitTime(location: LocationResult, start: string): Promise<LocationTransitResult| any> {
        const query: GoogleDistanceRequest = {
            destinations: location.address,
            key: process.env.GOOGLE_DISTANCE_APIKEY,
            language: 'en',
            mode: 'transit',
            origins: 'NW6+1HZ',
            units: 'imperial',
        };

        if (start) {
            query.arrival_time = Math.max(moment().unix(), moment(start).subtract(30, 'minutes').seconds());
        }

        return new Promise(resolve => {
            request
                .get('https://maps.googleapis.com/maps/api/distancematrix/json')
                .query(query)
                .end((err, res) => {
                    if (err || res.body.status !== 'OK') {
                        resolve();
                    } else {
                        const element = res.body.rows[0].elements[0];

                        if (element.status && element.status === 'ZERO_RESULTS') {
                            resolve();
                        } else {
                            const result: LocationTransitResult = {
                                time: element.duration.value,
                            };

                            resolve(result);
                        }
                    }
                });
        });
    }

    public getMap(location: LocationResult) {
        return {
            url: this.getMapUrl(location),
            image: this.getMapImage(location),
        };
    }

    private getMapUrl(location: LocationResult): string {
        return encodeURI(`https://maps.google.com/maps?q=${location.address}&hl=en&t=m&z=15`);
    }

    private getMapImage(location: LocationResult, width: number = 640, height: number = 480) {
        const mapParams = {
            key: process.env.GOOGLE_MAP_APIKEY,
            language: 'en',
            maptype: 'roadmap',
            markers: `color:red|${location.address}`,
            scale: 2,
            sensor: false,
            size: `${width}x${height}`,
            zoom: 15,
        };

        const query = Object.keys(mapParams).reduce((str, key) => `${str}&${key}=${mapParams[key].toString()}`, '').substr(1);

        return {
            url: `https://maps.googleapis.com/maps/api/staticmap?${encodeURI(query)}`,
            description: `map of a ${location.heading}`,
            width,
            height,
        };
    }
}
