<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BookController extends Controller
{
    public function index(Request $request): Response
    {
        $books = Book::query()
            ->when($request->search, fn($q) =>
                $q->where('judul', 'like', "%{$request->search}%")
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Books/Index', [
            'books'   => $books,
            'filters' => $request->only('search'),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Books/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'judul'     => 'required|string|max:255',
            'image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'deskripsi' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['judul']);

        if ($request->hasFile('image')) {
            $validated['image'] = $request
                ->file('image')
                ->store('books', 'public');
        }

        Book::create($validated);

        return to_route('books.index')->with('toast', [
            'type'    => 'success',
            'message' => __('Buku berhasil ditambahkan.'),
        ]);
    }

    public function show(Book $book): Response
    {
        return Inertia::render('Books/Show', [
            'book' => $book,
        ]);
    }

    public function edit(Book $book): Response
    {
        return Inertia::render('Books/Edit', [
            'book' => $book,
        ]);
    }

    public function update(Request $request, Book $book): RedirectResponse
    {
        $validated = $request->validate([
            'judul'     => 'required|string|max:255',
            'image'     => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'deskripsi' => 'nullable|string',
        ]);

        if ($book->judul !== $validated['judul']) {
            $validated['slug'] = Str::slug($validated['judul']);
        }

        if ($request->hasFile('image')) {
            if ($book->image) {
                Storage::disk('public')->delete($book->image);
            }

            $validated['image'] = $request
                ->file('image')
                ->store('books', 'public');
        } else {
            unset($validated['image']);
        }

        $book->update($validated);

        return to_route('books.index')->with('toast', [
            'type'    => 'success',
            'message' => __('Buku berhasil diperbarui.'),
        ]);
    }

    public function destroy(Book $book): RedirectResponse
    {
        if ($book->image) {
            Storage::disk('public')->delete($book->image);
        }

        $book->delete();

        return to_route('books.index')->with('toast', [
            'type'    => 'success',
            'message' => __('Buku berhasil dihapus.'),
        ]);
    }
}