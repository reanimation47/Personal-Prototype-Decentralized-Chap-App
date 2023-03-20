import GUN from 'gun';
import 'gun/sea'; // Security, Encryption, Authorization
import 'gun/axe';
import { writable } from 'svelte/store'

//Database
export const db = GUN();

//GUN user
export const user = db.user().recall({
    sessionStorage: true
})

//Current User's username
export const username = writable('');

user.get('alias').on(v => username.set(v));

db.on('auth', async (event) =>{
    const alias = await user.get('alias'); //get username string
    username.set(alias);

    console.log(`user ${alias} signed in`);
});