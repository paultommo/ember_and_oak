function setCartText(count) {
  const bubbles = document.querySelectorAll('#cart-icon-bubble');
  bubbles.forEach((el) => {
    const text = count > 0 ? `Cart (${count})` : 'Cart';
    if (el.textContent.trim() !== text) {
      el.innerHTML = text;
    }
  });
}

function fetchAndSetCart() {
  fetch('/cart.js')
    .then((res) => res.json())
    .then((cart) => setCartText(cart.item_count))
    .catch(() => {});
}

// Watch for Dawn restoring the SVG cart markup and override it
function observeCartBubble() {
  const bubble = document.getElementById('cart-icon-bubble');
  if (!bubble) return;

  fetchAndSetCart();

  const observer = new MutationObserver(() => {
    if (bubble.querySelector('svg') || bubble.querySelector('.cart-count-bubble')) {
      fetchAndSetCart();
    }
  });

  observer.observe(bubble, { childList: true, subtree: true });
}

// AJAX add-to-cart for overlay buttons
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
      fetchAndSetCart();
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

document.addEventListener('DOMContentLoaded', observeCartBubble);
