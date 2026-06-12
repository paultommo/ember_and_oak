document.addEventListener('click', function (e) {
  const btn = e.target.closest('.card__overlay-atc');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  const form = btn.closest('.card__overlay-form');
  const id = form.querySelector('[name="id"]').value;
  const quantity = form.querySelector('[name="quantity"]').value || 1;

  btn.textContent = 'Adding...';
  btn.disabled = true;

  fetch('/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: parseInt(id), quantity: parseInt(quantity) }),
  })
    .then((res) => res.json())
    .then(() => {
      btn.textContent = 'Added!';
      updateCartCount();
      setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.disabled = false;
      }, 1800);
    })
    .catch(() => {
      btn.textContent = 'Error';
      btn.disabled = false;
    });
});

function updateCartCount() {
  fetch('/cart.js')
    .then((res) => res.json())
    .then((cart) => {
      const bubbles = document.querySelectorAll('#cart-icon-bubble');
      bubbles.forEach((el) => {
        const count = cart.item_count;
        el.textContent = count > 0 ? `Cart (${count})` : 'Cart';
      });
    });
}
