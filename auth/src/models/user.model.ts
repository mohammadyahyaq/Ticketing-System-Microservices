import { Schema, model, Model, Document } from "mongoose";

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


userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = model<UserDoc, UserModel>('User', userSchema);

export { User };