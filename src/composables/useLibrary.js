import { computed } from 'vue'
import { useLocalStorage } from './useLocalStorage'
import { seedBooks, seedBorrowings } from '../data/seed'

const books = useLocalStorage('pageturn_books', seedBooks)
const borrowings = useLocalStorage('pageturn_borrowings', seedBorrowings)
const notifications = useLocalStorage('pageturn_notifications', [])

const makeId = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export function useLibrary() {
  const categories = computed(() => [...new Set(books.value.map(book => book.category).filter(Boolean))].sort())
  const availableBooks = computed(() => books.value.filter(book => book.availableCopies > 0))
  const pendingBorrowings = computed(() => borrowings.value.filter(item => item.status === 'pending'))

  function createBook(payload) {
    const totalCopies = Math.max(0, Number(payload.totalCopies) || 0)
    books.value.unshift({
      ...payload,
      id: makeId('b'),
      year: Number(payload.year) || new Date().getFullYear(),
      totalCopies,
      availableCopies: totalCopies,
    })
  }

  function updateBook(id, payload) {
    const index = books.value.findIndex(book => book.id === id)
    if (index < 0) return { ok: false, message: 'Book not found.' }
    const old = books.value[index]
    const currentlyBorrowed = old.totalCopies - old.availableCopies
    const nextTotal = Math.max(currentlyBorrowed, Number(payload.totalCopies) || 0)
    books.value[index] = {
      ...old,
      ...payload,
      year: Number(payload.year) || old.year,
      totalCopies: nextTotal,
      availableCopies: Math.max(0, nextTotal - currentlyBorrowed),
    }
    return { ok: true }
  }

  function deleteBook(id) {
    const activeLoan = borrowings.value.some(item => item.bookId === id && ['pending', 'approved'].includes(item.status))
    if (activeLoan) return { ok: false, message: 'This book has a pending or active borrowing. Resolve it before deleting.' }
    books.value = books.value.filter(book => book.id !== id)
    return { ok: true }
  }

  function requestBorrow(bookId, userId) {
    const book = books.value.find(item => item.id === bookId)
    if (!book) return { ok: false, message: 'Book not found.' }
    if (book.availableCopies < 1) return { ok: false, message: 'No copies are currently available.' }
    const hasActive = borrowings.value.some(item => item.bookId === bookId && item.userId === userId && ['pending', 'approved'].includes(item.status))
    if (hasActive) return { ok: false, message: 'You already have a pending request or active loan for this book.' }
    borrowings.value.unshift({
      id: makeId('br'),
      bookId,
      userId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      dueAt: null,
      returnedAt: null,
    })
    return { ok: true, message: 'Borrow request sent to the library admin.' }
  }

  function addMemberNotification(userId, borrowingId, type, title, message) {
    notifications.value.unshift({
      id: makeId('nt'),
      userId,
      borrowingId,
      type,
      title,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    })
  }

  function approveBorrow(id) {
    const loan = borrowings.value.find(item => item.id === id)
    if (!loan || loan.status !== 'pending') return { ok: false, message: 'This request is no longer pending.' }
    const book = books.value.find(item => item.id === loan.bookId)
    if (!book || book.availableCopies < 1) return { ok: false, message: 'No copies are currently available.' }
    book.availableCopies -= 1
    loan.status = 'approved'
    loan.dueAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    loan.approvedAt = new Date().toISOString()
    const bookTitle = book.title || 'your requested book'
    const dueDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(loan.dueAt))
    addMemberNotification(loan.userId, loan.id, 'approved', 'Book approved — visit the library room', `Good news! Your request for "${bookTitle}" has been approved. Please visit the library room to collect your book and bring your student ID. Return it by ${dueDate}.`)
    return { ok: true }
  }

  function rejectBorrow(id) {
    const loan = borrowings.value.find(item => item.id === id)
    if (!loan || loan.status !== 'pending') return { ok: false, message: 'This request is no longer pending.' }
    loan.status = 'rejected'
    loan.rejectedAt = new Date().toISOString()
    const book = books.value.find(item => item.id === loan.bookId)
    addMemberNotification(loan.userId, loan.id, 'rejected', 'Book request not approved', `Your request for "${book?.title || 'the requested book'}" was not approved. Please contact the library admin if you need more information.`)
    return { ok: true }
  }

  function returnBorrow(id, userId = null) {
    const loan = borrowings.value.find(item => item.id === id)
    if (!loan || loan.status !== 'approved') return { ok: false, message: 'Only approved loans can be returned.' }
    if (userId && loan.userId !== userId) return { ok: false, message: 'You can only return your own books.' }
    const book = books.value.find(item => item.id === loan.bookId)
    if (book) book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1)
    loan.status = 'returned'
    loan.returnedAt = new Date().toISOString()
    return { ok: true }
  }

  function markNotificationRead(id, userId) {
    const notification = notifications.value.find(item => item.id === id && item.userId === userId)
    if (notification) notification.read = true
  }

  function markAllNotificationsRead(userId) {
    notifications.value.forEach(item => {
      if (item.userId === userId) item.read = true
    })
  }

  function cancelRequest(id, userId) {
    const loan = borrowings.value.find(item => item.id === id)
    if (!loan || loan.userId !== userId || loan.status !== 'pending') {
      return { ok: false, message: 'Only your own pending requests can be cancelled.' }
    }
    loan.status = 'cancelled'
    return { ok: true }
  }

  return {
    books, borrowings, notifications, categories, availableBooks, pendingBorrowings,
    createBook, updateBook, deleteBook, requestBorrow, approveBorrow,
    rejectBorrow, returnBorrow, cancelRequest, markNotificationRead, markAllNotificationsRead,
  }
}
