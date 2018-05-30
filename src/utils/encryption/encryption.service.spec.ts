import { EncryptionService } from './encryption.service';

import * as chai from 'chai';

const expect = chai.expect;

describe('Encryption Service', () => {

    let strings: { encryptedText: string, decryptedText: string }[];

    before(() => {
        process.env.ENCRYPTION_KEY = 'abcdef0123456789abcdef0123456789';

        // tslint:disable:max-line-length
        strings = [
            {
                decryptedText: 'On the Ning Nang Nong',
                encryptedText: 'cdccaeb3d4527363a35705c17b30324a:0acf377db20fe1545c81aea74392c7638072602e9c6e23da4c4cdcb877379967',
            },
            {
                decryptedText: 'TestString1',
                encryptedText: 'e620e9e06fa0f2bbe3d66e4ea5bfd783:dcecd52feaeab4cd2ae40e5d50055f81',
            },
            {
                decryptedText: 'L9UMquoRPk6Bjj&nJJbvHQ])b4ru#r=uJdhaLq7LQU&Hy96g&)8VGwL32Xh+%q4K',
                encryptedText: '8edf31aa386a4ae81a539e4b5ab3f755:ae23bdb751d7be00eac52bcb896d65159106822a276f8d836dfff4073a73ba950cef1369257d010cc70ac63866923268a3be7e4ab9856f5632c12704df05913856885f69112dbb16dcd5ff9c13666692',
            },
            {
                decryptedText: '{"a":1,"b":{"a":1,"b":"xyz","c":["a","b",1]}}',
                encryptedText: '62cda04fa058fa07caf0b14248fccae7:473f1768953240d0b5c0793eddd1c018e2c607c4e5d87809d9a052a2a2aee4ad129de44b12e1635b90e05fde4e72c0cf',
            },
        ];
        // tslint:enable:max-line-length
    });

    it('should be able to decrypt strings', () => {
        strings.forEach((s) => {
            expect(EncryptionService.decrypt(s.encryptedText)).to.be.a.string(s.decryptedText);
        });
    });

    it('should encrypt strings differently each time', () => {
        strings.forEach((s) => {
            const newEncryptedText = EncryptionService.encrypt(s.decryptedText);
            expect(newEncryptedText).not.to.be.string(s.encryptedText);
            expect(EncryptionService.decrypt(newEncryptedText)).to.be.string(s.decryptedText);
        });
    });
});