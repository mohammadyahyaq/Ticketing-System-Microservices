import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'; // to convert the promist of scrypt implementation to async await implementation

const scryptAsync = promisify(scrypt);

export class Password {
    static async toHash(password: string) {
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptAsync(password, salt, 64)) as Buffer;

        return `${buffer.toString('hex')}.${salt}`; // we will basically save the salt and the password in the same attribute
    }

    static async compare(storedPassword: string, suppliedPassword: string) {
        const [hashedPassword, salt] = storedPassword.split('.'); // destructure the hash and the salt in seperate variables!
        const buffer = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

        return buffer.toString('hex') === hashedPassword; // now we could validate the password
    }
}