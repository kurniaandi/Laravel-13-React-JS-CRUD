import { useState } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import bookRoutes from '@/routes/books'
import { dashboard } from '@/routes'

interface Book {
  id: number
  judul: string
  deskripsi: string | null
  image: string | null
}

interface Props {
  book: Book
}

Edit.layout = {
  breadcrumbs: [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Buku', href: bookRoutes.index.url() },
    { title: 'Edit Buku', href: '#' },
  ],
}

export default function Edit({ book }: Props) {
  const [preview, setPreview] = useState<string | null>(
    book.image ? `/storage/${book.image}` : null,
  )
  const [dragOver, setDragOver] = useState(false)

  const form = useForm({
    judul: book.judul ?? '',
    deskripsi: book.deskripsi ?? '',
    image: null as File | null,
    _method: 'PUT',
  })

  function handleFile(file: File | undefined) {
    if (!file) return
    form.setData('image', file)
    setPreview(URL.createObjectURL(file))
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0])
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) handleFile(file)
  }

  function removeImage() {
    setPreview(null)
    form.setData('image', null)
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    form.post(bookRoutes.update.url(book.id), { forceFormData: true })
  }

  return (
    <>
      <Head title="Edit Buku" />

      <div
        className="flex h-full flex-1 flex-col gap-5 overflow-x-auto p-5"
        style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-6 w-1 rounded-full bg-gradient-to-b from-violet-500 to-indigo-500" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Buku</h1>
            </div>
            <p className="ml-3.5 pl-2.5 text-sm text-muted-foreground">
              Perbarui informasi buku{' '}
              <span className="font-medium text-foreground">{book.judul}</span>
            </p>
          </div>

          <Link
            href={bookRoutes.index.url()}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:border-violet-200 dark:hover:border-violet-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </Link>
        </div>
        <div className="rounded-2xl border border-sidebar-border/60 dark:border-sidebar-border bg-card overflow-hidden shadow-sm">
          <form onSubmit={submit} encType="multipart/form-data">
            <div className="divide-y divide-border/60">

              {/* ── Judul ─────────────────────────────────────────────────── */}
              <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-3 sm:gap-6">
                <div className="flex flex-col gap-0.5">
                  <label className="text-sm font-semibold text-foreground">Judul Buku</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Masukkan judul lengkap buku
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={form.data.judul}
                    onChange={(e) => form.setData('judul', e.target.value)}
                    placeholder="Contoh: Bumi Manusia"
                    className={`w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                      form.errors.judul
                        ? 'border-rose-400 focus:ring-rose-500/30'
                        : 'border-input focus:ring-violet-500/40 focus:border-violet-400'
                    }`}
                  />
                  {form.errors.judul && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {form.errors.judul}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-3 sm:gap-6">
                <div className="flex flex-col gap-0.5">
                  <label className="text-sm font-semibold text-foreground">Deskripsi</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Ringkasan singkat tentang isi buku
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <textarea
                    rows={4}
                    value={form.data.deskripsi}
                    onChange={(e) => form.setData('deskripsi', e.target.value)}
                    placeholder="Tulis deskripsi buku..."
                    className={`w-full resize-none rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                      form.errors.deskripsi
                        ? 'border-rose-400 focus:ring-rose-500/30'
                        : 'border-input focus:ring-violet-500/40 focus:border-violet-400'
                    }`}
                  />
                  {form.errors.deskripsi && (
                    <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {form.errors.deskripsi}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-3 sm:gap-6">
                <div className="flex flex-col gap-0.5">
                  <label className="text-sm font-semibold text-foreground">Cover Buku</label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    JPG, PNG, atau WEBP.
                    <br />Maksimal 2MB.
                    <br />Kosongkan jika tidak ingin mengubah.
                  </p>
                </div>

                <div className="sm:col-span-2 flex items-start gap-4">
                  {/* Preview panel */}
                  <div className="shrink-0">
                    {preview ? (
                      <div className="group relative h-28 w-20 overflow-hidden rounded-xl border border-border shadow-sm">
                        <img
                          src={preview}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-dashed border-border bg-muted/40">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-muted-foreground/40"
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
                  </div>
                  <div className="flex-1">
                    <label
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={onDrop}
                      className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-7 text-center transition-all ${
                        dragOver
                          ? 'border-violet-400 bg-violet-50/60 dark:bg-violet-900/20'
                          : form.errors.image
                          ? 'border-rose-300 bg-rose-50/40 dark:bg-rose-900/10'
                          : 'border-border bg-muted/20 hover:border-violet-300 hover:bg-violet-50/30 dark:hover:bg-violet-900/10'
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        dragOver ? 'bg-violet-100 dark:bg-violet-800/40' : 'bg-muted'
                      }`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 transition-colors ${dragOver ? 'text-violet-500' : 'text-muted-foreground/60'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Seret & lepas gambar di sini
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          atau{' '}
                          <span className="font-semibold text-violet-600 dark:text-violet-400">
                            klik untuk memilih
                          </span>
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="sr-only"
                      />
                    </label>
                    {form.errors.image && (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-rose-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {form.errors.image}
                      </p>
                    )}
                    {preview && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {form.data.image ? 'Gambar baru siap diunggah' : 'Cover saat ini'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 border-t border-border/60 bg-muted/20 px-6 py-4">
              <Link
                href={bookRoutes.index.url()}
                className="inline-flex items-center rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted hover:border-zinc-300 dark:hover:border-zinc-600"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={form.processing}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {form.processing ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}