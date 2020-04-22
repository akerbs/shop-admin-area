'use strict';


{
  const $ = (qs) => document.querySelector(qs);
  const $$ = (qs) => Array.from(document.querySelectorAll(qs));

  const DOM = {
    tableOverview: $('.m-table-overview'),
    tableOverviewBody: $('.m-table-overview > tbody'),
    modalProduct: $('.m-modal-product'),
    modalDelete: $('.m-modal-delete'), 
    formProduct: $('.form-product'),

    btnProductAdd: $('.btn-add')
  };


  const init = () => {
    loadProducts();

    DOM.btnProductAdd.addEventListener('click', onBtnProductAddClick);
  }

  const loadProducts = () => {
    fetch('/products')
      .then((response) => response.json())
      .then((products) => generateTable(products));


    // fetch("/product")
    // .then( (res) => res.json() )
    // .then( (codes) => Promise.all( codes.map( ( (c) => fetch("/product/" + c) ) ) ) )
    // .then( (res) => Promise.all( res.map( (r) => r.json() ) ) )
    // .then( (products) => generateTable(products) );
  }

  const generateTable = (products) => {

    generateTableRows(products);
  }

  const generateTableRows = (products) => {
    //console.log(products);
    const rows = products.map((product) => {
      const row = DOM.tableOverviewBody.querySelector('tr').cloneNode(true);
      const btnEdit = row.querySelector('.btn-edit');

      // <button class="btn btn-primary btn-edit" data-toggle="modal" data-target="#modal-product-action"><i class="fas fa-edit">...</button>
      btnEdit.dataset.id = product.code; 
      // <button class="btn btn-primary btn-edit" data-toggle="modal" data-target="#modal-product-action" data-id="[CODE]"><i class="fas fa-edit">...</button>

      // console.log(btnEdit);
      // console.log(btnEdit.dataset);
      
      // btnEdit.setAttribute('data-id', product.code);
      
      const btnDelete = row.querySelector('.btn-delete');
      btnDelete.dataset.id = product.code;

      btnEdit.addEventListener('click', onBtnProductEditClick);
      btnDelete.addEventListener('click', onBtnProductDeleteClick);
      
      row.querySelector('[data-code]').textContent = product.code;
      row.querySelector('[data-description]').textContent = product.shortDescription;
      row.querySelector('[data-tagline]').textContent = product.tagline;
      row.querySelector('[data-quantity]').textContent = product.quantity;
      row.querySelector('[data-price]').textContent = product.price;
      row.querySelector('[data-stockwarn]').textContent = product.stockwarn;

      return row; 
    });   

    DOM.tableOverviewBody.textContent = '';
    rows.forEach((row) => DOM.tableOverviewBody.appendChild(row));    
  }


  const onBtnProductAddClick = (event) => {
    clearFormProduct();
    setModalProductContent();
  }


  const onBtnProductDeleteClick = (event) => {
    setModalDeleteContent(event.currentTarget.dataset.id);
  }

  const onBtnProductEditClick = (event) => {
    console.log(event, event.currentTarget);
    setModalProductContent(event.currentTarget.dataset.id);
  }

  const setModalDeleteContent = (code) => {
    DOM.modalDelete.querySelector('.product-code').textContent = code;
    DOM.modalDelete.querySelector('.btn-confirm-delete').addEventListener('click', (event) => {
      fetch(`/product/${code}`, { method: 'DELETE'})
        .then((res) => {
          loadProducts();
          jQuery(DOM.modalDelete).modal('hide');
        });
    });
  }

  const setModalProductContent = (code = '') => {
  
    if(code === '' || typeof(code) === undefined) {
      // Add
      DOM.formProduct.querySelector('#input-code').readOnly = false;
      
      DOM.formProduct.addEventListener('submit', (event) => {
        onFormProductSubmit(event, 'POST');
      } );

    } else {
      // GET Product by Code

      DOM.formProduct.querySelector('#input-code').readOnly = true;

      fetch(`/product/${code}`)
        .then((res) => res.json())
        .then((product) => {
        DOM.formProduct.querySelector('#input-code').value = product.code; 
        DOM.formProduct.querySelector('#input-tagline').value = product.tagline; 
        DOM.formProduct.querySelector('#textarea-description').value = product.shortDescription; 
        DOM.formProduct.querySelector('#input-quantity').value = product.quantity; 
        DOM.formProduct.querySelector('#input-price').value = product.price.replace(',', '.'); 


        DOM.formProduct.addEventListener('submit', (event) => {
          onFormProductSubmit(event, 'PUT')
        });

      })
    }

    

  }


  const onFormProductSubmit = (event, method) => {
    event.preventDefault(); // Standardverhalten wird unterbunden. Fomular wird nicht direkt versendet.

    // alternative mit new FormData();
    const product = {
      code: DOM.formProduct.querySelector('#input-code').value,
      tagline: DOM.formProduct.querySelector('#input-tagline').value,
      shortDescription: DOM.formProduct.querySelector('#textarea-description').value,
      quantity: DOM.formProduct.querySelector('#input-quantity').value,
      price: DOM.formProduct.querySelector('#input-price').value
    }
    
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    
    // UPDATEORPOST - update or post DATE 
    fetch('/product', {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    }).then((res) => {
      loadProducts();
      clearFormProduct();
      jQuery(DOM.modalProduct).modal('hide');
    });
  }

  const clearFormProduct = () => {
    DOM.formProduct.reset(); // Form Data wird über reset() -Methode von JS geleert;
    Array.from(DOM.formProduct.elements).map( (el) => {
      if(el.value) {
        el.value = '';
      }
    });
  }

  init();

}

