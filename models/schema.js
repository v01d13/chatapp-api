import { Schema, model } from 'mongoose';
loginSchema = new Schema({username: String, password: String}, {timestamps: true});
export const LoginSchema = model('Login', schema);
schemaMessage = new Schema({username: String, message: String});
export const Message = model('Message', schema);
schemaRegistration = new Schema({username: String, password: String, email: String});
export const Registration = mongoos.model('Registration', schemaRegistration);