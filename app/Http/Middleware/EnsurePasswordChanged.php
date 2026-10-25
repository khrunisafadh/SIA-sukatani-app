<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordChanged
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password) {
            if (! $request->routeIs('password.first-login', 'password.first-login.update', 'logout')) {
                if ($request->expectsJson() && ! $request->header('X-Inertia')) {
                    return response()->json([
                        'message' => 'Anda wajib mengganti password sementara sebelum mengakses sistem.',
                    ], 403);
                }

                return redirect()->route('password.first-login');
            }
        }

        return $next($request);
    }
}
