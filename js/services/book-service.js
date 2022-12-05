'use strict'

const PAGE_SIZE = 6

var gPageIdx = 0
var gBooks = _createBooks()
var gPriceFilter = 0
var gRateFilter = 0
var gSearchStr = ''

_saveBooksInStorage()

function _createBooks() {
    var books = loadFromStorage('booksDB')
    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 21; i++) {
            books.push(_createBook('test book', _getRandomInt(1, 40)))
        }
    }
    return books
}

function _createBook(title, price) {
    return {
        id: _uuidv4(),
        title,
        price,
        imgUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80',
        rate: 0
    }
}

function getBooks() {
    const startIdx = gPageIdx * PAGE_SIZE
    if (!gPriceFilter && !gRateFilter && !gSearchStr) return gBooks.slice(startIdx, startIdx + PAGE_SIZE)
    const books = gBooks.filter(book => {
        const bookTitle = book.title.toLowerCase()
        return book.price <= gPriceFilter && book.rate >= gRateFilter && bookTitle.includes(gSearchStr) ||
            !gPriceFilter && book.rate >= gRateFilter && bookTitle.includes(gSearchStr)
    })
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function getBook(bookId) {
    return gBooks.find(book => book.id === bookId)
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => book.id === bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksInStorage()
}

function addBook(title, price) {
    const newBook = _createBook(title, price)
    gBooks.push(newBook)
    _saveBooksInStorage()
}

function updateBook(bookId, price) {
    const book = getBook(bookId)
    book.price = price
    _saveBooksInStorage()
}

function setBookRate(bookId, amount) {
    const book = getBook(bookId)
    book.rate += amount
    _saveBooksInStorage()
}

function setPriceFilter(maxPrice) {
    gPageIdx = 0
    gPriceFilter = maxPrice
}

function setRateFilter(minRate) {
    gPageIdx = 0
    gRateFilter = minRate
}

function setSearchStr(searchStr) {
    gPageIdx = 0
    gSearchStr = searchStr
}

function getFilterValues() {
    return { maxPrice: gPriceFilter, minRate: gRateFilter, searchStr: gSearchStr }
}

function setBookFilter(filterBy) {
    gPageIdx = 0
    gPriceFilter = filterBy.maxPrice
    gRateFilter = filterBy.minRate
    gSearchStr = filterBy.searchStr
}

function nextPage() {
    if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) return false
    gPageIdx++
    return gPageIdx
}

function prevPage() {
    if ((gPageIdx - 1) * PAGE_SIZE < 0) return false
    gPageIdx--
    return gPageIdx
}

function getPageCount(){
    return Math.floor(gBooks.length / PAGE_SIZE)
}

function _saveBooksInStorage() {
    saveToStorage('booksDB', gBooks)
}

function _uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function _getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
}