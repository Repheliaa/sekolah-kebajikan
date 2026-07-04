<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register_with_username(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'username' => 'testuser',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', ['username' => 'testuser']);
        $response->assertRedirect(route('dashboard', absolute: false));
    }
}
