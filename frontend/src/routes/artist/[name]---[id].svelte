<script context="module">
	import { get } from '../../lib/api';
	export async function load({ params, fetch, session, stuff }) {
		const { response: artistResponse, error: artistError } = await get(
			fetch,
			`/api/artists/${params.id}`
		);
		const { response: songsResponse, error: songsError } = await get(
			fetch,
			`/api/artists/${params.id}/songs`
		);

		// TODO handle errors by sending it to the page and renderin appropriate error message
		if (artistError || songsError) {
			return {
				status: 200,
				props: {
					name: '',
					songs: []
				}
			};
		} else {
			return {
				status: 200,
				props: {
					name: artistResponse.name,
					songs: songsResponse
				}
			};
		}
	}
</script>

<script>
	import SongListItem from '../../components/list/song.list.item.svelte';

	export let name = '';
	export let songs = [];
</script>

<svelte:head>
	<title>{name}</title>
</svelte:head>

<div class="p-4">
	<div class="pb-2 text-center">{name}</div>
	{#each songs as song}
		<SongListItem {song} />
	{/each}
</div>
