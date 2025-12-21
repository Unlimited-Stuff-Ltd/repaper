<script lang="ts">
    import { page } from "$app/state";
    import { Button } from 'bits-ui';
</script>

<main class="text-center">
    <h1 class="pt-40 text-5xl font-black">Repaper</h1>
    <h2 class="my-20 text-2xl">Error {page.status}: {page.error?.message}</h2>
    <div>
        <Button.Root href="/">Home</Button.Root>
    </div>
</main>