<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Support\Str;

#[Fillable([
    'judul',
    'slug',
    'image',
    'deskripsi'
])]
class Book extends Model
{
    protected static function booted(): void
    {
        static::creating(function ($book) {
            if (empty($book->slug)) {
                $book->slug = Str::slug($book->judul);
            }
        });
    }
}