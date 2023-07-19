const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId').value;
    const token = btn.parentNode.querySelector('[name=_csrf').value;

    const productElement = btn.closest('article');

    fetch('/admin/product/' + productId, {
        method: 'DELETE',
        headers: {
            'csrf-token': token
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            productElement.parentNode.removeChild(productElement);
            // another method that doesn't work in ie is:
            // productElement.remove(productElement)
        })
        .catch(err => console.log('err: ', err))
};