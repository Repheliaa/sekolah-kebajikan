<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^([A-Z][a-z]*(?:[\'\-][A-Z][a-z]*)?)(\s+[A-Z][a-z]*(?:[\'\-][A-Z][a-z]*)?)*$/',
            ],
            'username' => ['required', 'string', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', 'min:8'],
        ], [
            'name.regex' => 'Nama lengkap harus diawali huruf kapital pada setiap kata, misalnya Budi Setiawan.',
            'username.unique' => 'Username sudah dipakai. Silakan pilih username lain.',
            'password.min' => 'Password minimal 8 karakter.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
