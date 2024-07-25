<script lang="ts">
	import IconBrandGoogle from '@tabler/icons-svelte/IconBrandGoogle.svelte';
	import { SignIn } from '@auth/sveltekit/components';
	import { signIn } from '@auth/sveltekit/client';
	import type { PageData } from './$types';
</script>

<div class="grid h-screen w-screen place-items-center">
	<div class="m-8 rounded-lg bg-base-200 p-8">
		<p class="text-3xl font-bold">Welcome Back!</p>
		<p class="text-sm">Sign in to continue</p>
		<div class="divider" />
		<button class="flex flex-row items-center btn w-full" on:click={() => signIn('google')}>
			<IconBrandGoogle />
			<div class=""> Sign in with Google </div>
		</button>
	</div>
</div>
