import Counter from './counter.svelte';

const app = new Counter({
  target: document.querySelector('.here'),
  data: { name: 'world'}
});

app.set({ name: 'everybody'});