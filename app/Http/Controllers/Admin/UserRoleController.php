<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserAccountRequest;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Models\User;
use App\Support\AuditLogger;
use App\Support\Roles;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserRoleController extends Controller
{
    public function index(Request $request): Response
    {
        $this->assertAdmin($request);

        $filters = [
            'q' => trim((string) $request->query('q', '')),
            'role' => (string) $request->query('role', ''),
        ];

        $query = User::query()
            ->orderByDesc('last_activity_at')
            ->orderByDesc('id');

        if ($filters['q'] !== '') {
            $search = $filters['q'];
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (in_array($filters['role'], Roles::all(), true)) {
            $query->where('role', $filters['role']);
        }

        $users = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users->through(fn (User $user) => $this->userPayload($user)),
            'filters' => $filters,
            'roleOptions' => Roles::labels(),
            'total' => User::query()->count(),
        ]);
    }

    public function store(StoreUserAccountRequest $request): RedirectResponse
    {
        $plainPassword = Str::password(20);

        $user = User::query()->create([
            'name' => $request->string('name'),
            'username' => $request->string('username'),
            'email' => $request->string('email'),
            'role' => $request->string('role'),
            'password' => $plainPassword,
            'is_active' => true,
            'email_verified_at' => null,
            'last_activity_at' => now(),
        ]);

        Password::sendResetLink(['email' => $user->email]);

        AuditLogger::record($request->user(), 'user.created', User::class, $user->id, [
            'role' => $user->role,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Akun berhasil ditambahkan. Tautan aktivasi dikirim ke email terdaftar.');
    }

    public function updateRole(UpdateUserRoleRequest $request, User $user): RedirectResponse
    {
        $newRole = (string) $request->string('role');
        $this->guardLastAdmin($request->user(), $user, $newRole);

        $previous = $user->role;
        $user->forceFill([
            'role' => $newRole,
            'last_activity_at' => now(),
        ])->save();

        AuditLogger::record($request->user(), 'user.role_updated', User::class, $user->id, [
            'from' => $previous,
            'to' => $newRole,
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Role berhasil diperbarui.');
    }

    public function resetAccess(Request $request, User $user): RedirectResponse
    {
        $this->assertAdmin($request);

        $status = Password::sendResetLink(['email' => $user->email]);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => 'Gagal mengirim tautan reset akses. Pastikan email akun valid.',
            ]);
        }

        $user->markActivity();

        AuditLogger::record($request->user(), 'user.reset_access', User::class, $user->id);

        return redirect()
            ->route('admin.users.index')
            ->with('success', 'Tautan reset akses telah dikirim ke email akun. Kata sandi tidak ditampilkan.');
    }

    /**
     * @return array<string, mixed>
     */
    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'role_label' => $user->roleLabel(),
            'status' => $user->statusLabel(),
            'is_active' => $user->is_active,
            'last_activity_at' => $user->last_activity_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            'is_self' => $user->id === auth()->id(),
        ];
    }

    private function guardLastAdmin(User $actor, User $target, string $newRole): void
    {
        if ($target->id === $actor->id && $target->role === Roles::KETUA_RT && $newRole !== Roles::KETUA_RT) {
            throw ValidationException::withMessages([
                'role' => 'Anda tidak dapat mengubah role akun Ketua RT Anda sendiri.',
            ]);
        }

        if ($target->role === Roles::KETUA_RT && $newRole !== Roles::KETUA_RT) {
            $adminCount = User::query()->where('role', Roles::KETUA_RT)->count();

            if ($adminCount <= 1) {
                throw ValidationException::withMessages([
                    'role' => 'Tidak dapat mengubah role admin terakhir.',
                ]);
            }
        }
    }

    private function assertAdmin(Request $request): void
    {
        abort_unless($request->user()?->canManageUsers(), 403);
    }
}
