<script lang="ts">
	let { children, active, icon = false, ...props } = $props();
</script>

<button
	data-state={active ? 'on' : 'off'}
	data-toggle-root
	class="data-[state=on]:text(--p-fg) border data-[state=off]:border-(--o) data-[state=off]:bg-(--bg) data-[state=off]:hover:bg-(--fg)/10 data-[state=on]:border-transparent data-[state=on]:bg-(--p)/90 data-[state=on]:text-(--p-fg) data-[state=on]:hover:bg-(--p) {icon
		? 'rounded-lg! p-1!'
		: ''}"
	{...props}>{@render children()}</button
>
