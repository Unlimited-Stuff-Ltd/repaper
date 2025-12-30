<script lang="ts">
	import { Slider } from 'bits-ui';

	let { value = $bindable(), ...props } = $props();
</script>

<Slider.Root type="single" class="relative m-auto flex w-full items-center" bind:value {...props}>
	<span
		class="relative h-4 w-full cursor-pointer overflow-hidden rounded-full border border-(--o) bg-(--bg)"
	>
		<Slider.Range class="h-full bg-(--p)" />
	</span>
	<Slider.Thumb
		index={0}
		class=" flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-(--o) bg-(--p) focus:outline-none"
	/>
</Slider.Root>
