import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

export class EncryptionService {

    public static encrypt(text: string): string {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, new Buffer(process.env.ENCRYPTION_KEY), iv);
        const buffer = Buffer.from(text, 'utf8');

        let encrypted = cipher.update(buffer);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    public static decrypt(text: string): string {
        const textParts = text.split(':');
        const iv = new Buffer(textParts.shift(), 'hex');
        const encryptedText = new Buffer(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, new Buffer(process.env.ENCRYPTION_KEY), iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    }
}