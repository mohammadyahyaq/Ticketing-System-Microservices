import { Schema, model, Model, Document } from "mongoose";
import { Password } from '../utils/password';

// interface that represents that type of User.build() parameter
interface UserAttrs {
    email: string;
    password: string;
}

// interface that represents the User model where we will add all the statics methods
interface UserModel extends Model<UserDoc> {
    build: (attrs: UserAttrs) => UserDoc;
}


// interface that represents the user document (after the user created)
interface UserDoc extends Document {
    email: string;
    password: string
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String, 
        required: true
    }
});

userSchema.pre('save', async function(done) {
    // we need to use function syntax to access this keyword for the current function
    if (this.isModified('password')) {
        // we need this condition to allow updating an existing document using the save() function
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});


userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };