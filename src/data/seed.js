export const seedBooks = [
  { id: 'b1', title: 'Atomic Habits', author: 'James Clear', category: 'Personal Growth', isbn: '9780735211292', year: 2018, totalCopies: 5, availableCopies: 3, description: 'A practical guide to building good habits, breaking bad ones, and making small changes that compound over time.', cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80' },
  { id: 'b2', title: 'The Psychology of Money', author: 'Morgan Housel', category: 'Finance', isbn: '9780857197689', year: 2020, totalCopies: 4, availableCopies: 2, description: 'Timeless lessons about wealth, greed, happiness, and how people think about money.', cover: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=600&q=80' },
  { id: 'b3', title: 'Clean Code', author: 'Robert C. Martin', category: 'Technology', isbn: '9780132350884', year: 2008, totalCopies: 3, availableCopies: 2, description: 'A software craftsmanship guide to writing readable, maintainable code.', cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80' },
  { id: 'b4', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', isbn: '9780061120084', year: 1960, totalCopies: 4, availableCopies: 4, description: 'A classic novel exploring justice, empathy, and childhood in the American South.', cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80' },
  { id: 'b5', title: 'The Design of Everyday Things', author: 'Don Norman', category: 'Design', isbn: '9780465050659', year: 2013, totalCopies: 3, availableCopies: 1, description: 'An influential introduction to human-centered design and making products intuitive.', cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80' },
  { id: 'b6', title: 'Deep Work', author: 'Cal Newport', category: 'Personal Growth', isbn: '9781455586691', year: 2016, totalCopies: 3, availableCopies: 3, description: 'Strategies for focused success in a distracted world.', cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80' },
  { id: 'b7', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', isbn: '9780547928227', year: 1937, totalCopies: 5, availableCopies: 4, description: 'Bilbo Baggins joins a quest filled with dwarves, dragons, and unexpected courage.', cover: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=600&q=80' },
  { id: 'b8', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen et al.', category: 'Technology', isbn: '9780262046305', year: 2022, totalCopies: 2, availableCopies: 1, description: 'A comprehensive textbook covering algorithms and their analysis.', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80' }
]

export const seedUsers = [
  { id: 'u-admin', name: 'Library Admin', email: 'admin@pageturn.local', password: 'admin123', role: 'admin', joinedAt: '2026-01-05T08:00:00.000Z' },
  { id: 'u-member', name: 'Alex Morgan', email: 'member@pageturn.local', password: 'member123', role: 'member', joinedAt: '2026-02-10T08:00:00.000Z' }
]

export const seedBorrowings = [
  { id: 'br-demo-1', bookId: 'b3', userId: 'u-member', status: 'approved', requestedAt: '2026-09-25T09:00:00.000Z', dueAt: '2026-10-15T09:00:00.000Z', returnedAt: null },
  { id: 'br-demo-2', bookId: 'b4', userId: 'u-member', status: 'pending', requestedAt: '2026-10-01T09:00:00.000Z', dueAt: null, returnedAt: null }
]
