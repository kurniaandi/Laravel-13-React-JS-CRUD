import { useEffect, useRef, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import bookRoutes from '@/routes/books'
import { dashboard } from '@/routes'

interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

interface Book {
  id: number
  judul: string
  slug: string
  deskripsi?: string
  image?: string
}

interface Props {
  books: {
    data: Book[]
    from: number
    to: number
    total: number
    last_page: number
    links: PaginationLink[]
  }
  filters?: {
    search?: string
  }
}

function DeleteModal({
  book,
  onConfirm,
  onCancel,
}: {
  book: Book
  onConfirm: () => void
  onCancel: () => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  function handleCancel() {
    setIsVisible(false)
    setTimeout(onCancel, 250)
  }

  function handleConfirm() {
    setIsVisible(false)
    setTimeout(onConfirm, 200)
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleCancel}
      />

      {/* Modal Panel */}
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300 dark:bg-zinc-900 ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-red-500 to-rose-600" />

        <div className="p-6">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 ring-8 ring-rose-50/50 dark:bg-rose-500/10 dark:ring-rose-500/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1H5"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Hapus Buku
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
              Tindakan ini tidak dapat dibatalkan. Buku berikut akan dihapus secara permanen.
            </p>

            {/* Book preview */}
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-left dark:border-zinc-700/60 dark:bg-zinc-800/50">
              {book.image ? (
                <img
                  src={`/storage/${book.image}`}
                  alt={book.judul}
                  className="h-12 w-9 flex-shrink-0 rounded-md object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-12 w-9 flex-shrink-0 items-center justify-center rounded-md bg-zinc-200 dark:bg-zinc-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {book.judul}
                </p>
                <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-400">
                  {book.slug}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 rounded-xl bg-rose-500 py-2.5 text-sm font-medium text-white shadow-sm shadow-rose-500/30 transition-all hover:bg-rose-600 hover:shadow-rose-500/40 active:scale-[0.98]"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

Index.layout = {
  breadcrumbs: [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Buku', href: bookRoutes.index.url() },
  ],
}

export default function Index({ books, filters }: Props) {
  const [search, setSearch] = useState(filters?.search ?? '')
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      router.get(
        bookRoutes.index.url({ query: { search: search || undefined } }),
        {},
        { preserveState: true, replace: true },
      )
    }, 400)
    return () => clearTimeout(timeoutRef.current)
  }, [search])

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    router.delete(bookRoutes.destroy.url(deleteTarget.id), {
      preserveScroll: true,
    })
    setDeleteTarget(null)
  }

  return (
    <>
      <Head title="Daftar Buku" />

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          book={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div
        className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-5"
        style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              {/* Decorative line */}
              <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Daftar Buku
              </h1>
            </div>
            <p className="ml-3.5 pl-2.5 text-sm text-muted-foreground">
              Kelola koleksi buku yang tersedia di sistem
            </p>
          </div>

          <Link
            href={bookRoutes.create.url()}
            className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:translate-y-[-1px] active:translate-y-0"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:rotate-90 duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            Tambah Buku
          </Link>
        </div>
        <div className="relative flex-1 rounded-2xl border border-sidebar-border/60 dark:border-sidebar-border bg-card overflow-hidden shadow-sm">

          {/* Top bar */}
          <div className="flex flex-col gap-3 border-b border-border/70 bg-muted/20 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari judul atau slug buku..."
                className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-400 transition-all"
              />
            </div>

            {/* Total badge */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-3 py-1.5 dark:border-emerald-700/40 dark:bg-emerald-900/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  {books.total} buku
                </span>
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-border/60 bg-muted/30">
                <tr>
                  {[
                    { label: '#', cls: 'w-10' },
                    { label: 'Cover', cls: 'w-16' },
                    { label: 'Judul', cls: '' },
                    { label: 'Slug', cls: '' },
                    { label: 'Deskripsi', cls: '' },
                    { label: 'Aksi', cls: 'text-center' },
                  ].map(({ label, cls }) => (
                    <th
                      key={label}
                      className={`px-5 py-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70 ${cls}`}
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/50">
                {books?.data?.length ? (
                  books.data.map((book, i) => (
                    <tr
                      key={book.id}
                      className="group hover:bg-violet-50/40 dark:hover:bg-violet-900/10 transition-colors duration-150"
                    >
                      {/* # */}
                      <td className="px-5 py-3.5 text-muted-foreground text-xs tabular-nums align-middle">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-muted/60 text-[10px] font-semibold text-muted-foreground">
                          {books.from + i}
                        </span>
                      </td>

                      {/* Cover */}
                      <td className="px-5 py-3.5 align-middle">
                        {book.image ? (
                          <div className="relative h-12 w-9 overflow-hidden rounded-lg border border-border/60 shadow-sm">
                            <img
                              src={`/storage/${book.image}`}
                              alt={book.judul}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-9 items-center justify-center rounded-lg border border-dashed border-border bg-muted/40">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-muted-foreground/40"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                              />
                            </svg>
                          </div>
                        )}
                      </td>

                      {/* Judul */}
                      <td className="px-5 py-3.5 align-middle">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-foreground leading-snug">
                            {book.judul}
                          </span>
                          <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                            ID #{book.id}
                          </span>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-3.5 align-middle">
                        <span className="inline-flex items-center rounded-lg border border-violet-200/60 bg-violet-50/70 px-2.5 py-1 font-mono text-[11px] text-violet-600 dark:border-violet-700/40 dark:bg-violet-900/20 dark:text-violet-400">
                          {book.slug}
                        </span>
                      </td>

                      {/* Deskripsi */}
                      <td className="px-5 py-3.5 align-middle max-w-xs">
                        <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                          {book.deskripsi || (
                            <span className="italic text-muted-foreground/40">
                              Tidak ada deskripsi.
                            </span>
                          )}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={bookRoutes.edit.url(book.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition-all hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-violet-100 dark:hover:border-violet-700 dark:hover:bg-violet-900/20 dark:hover:text-violet-400"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 0 1 2.828 0l.172.172a2 2 0 0 1 0 2.828L12 16H9v-3z"
                              />
                            </svg>
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(book)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200/70 bg-background px-3 py-1.5 text-xs font-medium text-rose-500 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-50 hover:shadow-rose-100 dark:border-rose-800/50 dark:hover:bg-rose-900/20"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1H5"
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Empty state */
                  <tr>
                    <td colSpan={6} className="px-4 py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-muted-foreground/30"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.2}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Tidak ada buku ditemukan</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Coba ubah kata kunci pencarian atau tambah buku baru.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-2 border-t border-border/60 bg-muted/10 px-5 py-3.5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            {books?.total ? (
              <p className="text-xs">
                Menampilkan{' '}
                <span className="font-semibold text-foreground">{books.from}–{books.to}</span>{' '}
                dari{' '}
                <span className="font-semibold text-foreground">{books.total}</span>{' '}
                buku
              </p>
            ) : (
              <p className="text-xs">Total 0 buku</p>
            )}

            {books?.last_page > 1 && (
              <div className="flex flex-wrap items-center gap-1">
                {books.links.map((link) =>
                  link.url ? (
                    <Link
                      key={link.label}
                      href={link.url}
                      preserveState
                      className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        link.active
                          ? 'border-violet-400/60 bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-sm shadow-violet-500/20'
                          : 'border-border bg-background text-foreground hover:bg-muted hover:border-violet-200'
                      }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ) : (
                    <span
                      key={link.label}
                      className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground/30 cursor-not-allowed"
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}