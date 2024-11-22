import { onMounted } from 'vue'

onMounted(() => {
  const img = document.querySelectorAll('p:has(img.doc)');

  // Log the results
  pWithDocImages.forEach((p) => {
    console.log(p);
  });

  // Example: Add a class to these <p> tags
  pWithDocImages.forEach((p) => {
    (p as HTMLElement).classList.add('highlight');
  });
});
