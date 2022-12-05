'use strict'

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    const books = getBooks()
    const strHTML = books.map(book => {
        return `<tr>
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>$${book.price}</td>
        <td><button class="read" onclick="onReadBook('${book.id}')">Read</button></td>
        <td><button class="update" onclick="onUpdateBook('${book.id}')">Update</button></td>
        <td><button class="delete" onclick="onRemoveBook('${book.id}')">Delete</button></td>
        </tr>`
    }).join('')
    document.querySelector('tbody').innerHTML = strHTML
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
}

function onAddBook() {
    const title = prompt('Book title?')
    const price = +prompt('Book price?')
    if(!price || !title) return
    addBook(title, price)
    renderBooks()
}

function onUpdateBook(bookId) {
    const book = getBook(bookId)
    const price = +prompt('Update price', book.price)
    if (price === book.price || !price) return
    updateBook(bookId, price)
    renderBooks()
}

function onReadBook(bookId) {
    renderBookModal(bookId)
}

function onCloseModal(elModal) {
    elModal.classList.remove('shown')
}

function onBookRateMinus(bookId) {
    const book = getBook(bookId)
    if(book.rate - 1 < 0) return
    setBookRate(bookId, -1)
    renderBookModal(bookId)
}

function onBookRatePlus(bookId) {
    const book = getBook(bookId)
    if(book.rate + 1 > 10) return
    setBookRate(bookId, 1)
    renderBookModal(bookId)
}

function renderBookModal(bookId){
    const book = getBook(bookId)
    const elModal = document.querySelector('.book-modal')
    const elSpan = elModal.querySelector('span')
    elSpan.innerHTML = `Title: ${book.title}<br>Price: $${book.price}`
    elSpan.innerHTML += `<div class="book-rate-container"><h4>Book rate</h4><button onclick="onBookRateMinus('${book.id}')">-</button><span>${book.rate}</span><button onclick="onBookRatePlus('${book.id}')">+</button></div>`
    elModal.classList.add('shown')
}

function onPriceFilter(maxPrice){
    setPriceFilter(+maxPrice)
    setUrlQuery(getFilterValues())
    renderBooks()
}

function onRateFilter(minRate){
    setRateFilter(+minRate)
    setUrlQuery(getFilterValues())
    renderBooks()
}

function onSearch(searchStr){
    setSearchStr(searchStr.toLowerCase())
    setUrlQuery(getFilterValues())
    renderBooks()
}

function setUrlQuery(filter = {}){
    const maxPrice = filter.maxPrice ? filter.maxPrice : 0
    const minRate = filter.minRate ? filter.minRate : 0
    const searchStr = filter.searchStr ? filter.searchStr : ''
    const queryStringParams = `?maxPrice=${maxPrice}&minRate=${minRate}&searchStr=${searchStr}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || 0,
        minRate: +queryStringParams.get('minRate') || 0,
        searchStr: queryStringParams.get('searchStr') || '',
    }

    if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.searchStr) return

    document.querySelector('.filter-max-price').value = filterBy.maxPrice
    document.querySelector('.filter-min-rate').value = filterBy.minRate
    document.querySelector('.filter-by-title').value = filterBy.searchStr
    setBookFilter(filterBy)
}

function onNextPage(elBtn){
    const pageIdx = nextPage()
    elBtn.disabled = pageIdx < getPageCount() ? false : true
    const elPrevBtn = document.querySelector('.prev-btn')
    if(!elBtn.disabled) elPrevBtn.disabled = false
    renderBooks()
}

function onPrevPage(elBtn){
    const pageIdx = prevPage()
    elBtn.disabled = !pageIdx ? true : false
    const elNextBtn = document.querySelector('.next-btn')
    if(!elBtn.disabled) elNextBtn.disabled = false
    renderBooks()
}