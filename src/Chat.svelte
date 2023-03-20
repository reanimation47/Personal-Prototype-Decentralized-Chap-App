<script>
    import Login from './Login.svelte';
    import {username, user} from './user';
    import { onMount } from 'svelte';

    import GUN from 'gun';
    import SEA from 'gun/sea';
    import ChatMessage from './ChatMessage.svelte';


    const db = GUN();
    const key = '#foo';

    let messages = [];
    let newMessage;

    onMount(() => {

        //Get Messages
        db.get('chat2')
            .map()
            .once( async (data, id) => {
                if (data)
                {
                    //const key = '#foo';

                    var message = {
                        who: await db.user(data).get('alias'),
                        what: (await SEA.decrypt(data.what, key)) + '',
                        when: GUN.state.is(data, 'what')
                    };

                    if (message.what)
                    {
                        messages = [...messages.slice(-100), message];
                    }
                }
            } );
    })

    async function sendMessage()
    {
        const secret = await SEA.encrypt(newMessage, key);
        const message = user.get('all').set({ what: secret});
        const index = new Date().toISOString();
        db.get('chat2').get(index).put(message);
        newMessage = '';
    }
</script>

<div class="container">
    {#if $username}
        <main>
            {#each messages as message (message.when)}
                <ChatMessage {message} sender={$username} />
            {/each}
        </main>

        <form on:submit|preventDefault={sendMessage}>
            <input type="text" placeholder="Type a message..." bind:value={newMessage} maxlength="100" />
            <button type="submit" disabled={!newMessage}>💥</button>
        </form>
    {:else}
        <Login />
    {/if}
</div>