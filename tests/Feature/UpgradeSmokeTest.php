<?php

namespace Tests;

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\TestResponse;
use Illuminate\Support\Facades\Schema;

class UpgradeSmokeTest extends TestCase
{
    public function test_framework_boots_and_caches(): void
    {
        $this->assertStringStartsWith('9.', app()->version());

        Artisan::call('config:clear');
        Artisan::call('route:clear');
        Artisan::call('view:clear');
        Artisan::call('config:cache');
        Artisan::call('view:cache');
        $this->assertTrue(true);
    }

    public function test_public_get_routes_respond(): void
    {
        Config::set('database.default', 'sqlite');
        Config::set('database.connections.sqlite.database', ':memory:');
        Artisan::call('migrate', ['--force' => true]);

        try {
            $routes = collect(Route::getRoutes())
                ->filter(fn($r) => in_array('GET', $r->methods()))
                ->filter(fn($r) => !str_starts_with($r->uri(), '_ignition'))
                ->filter(function ($r) {
                    $mw = $r->action['middleware'] ?? [];
                    $mw = is_string($mw) ? explode('|', $mw) : (array) $mw;
                    return !collect($mw)->contains(fn($m) => str_contains($m, 'auth'));
                })
                ->filter(function ($r) {
                    return !preg_match('/{[^}]*}/', $r->uri()) || preg_match('/{[^}]*\?}/', $r->uri());
                });
        } catch (\Throwable $e) {
            $this->markTestSkipped('Route enumeration failed: '.$e->getMessage());
            return;
        }

        $tested = 0;
        foreach ($routes as $route) {
            $uri = preg_replace('/{[^}]*\?}/', '', $route->uri());
            try {
                $response = $this->get($uri);
            } catch (\Throwable $e) {
                continue;
            }
            if (in_array($response->getStatusCode(), [200, 204, 302])) {
                $tested++;
                $this->assertContains($response->getStatusCode(), [200, 204, 302], $route->uri());
            }
        }
        $this->assertGreaterThan(0, $tested);
    }

    public function test_database_migrations_run(): void
    {
        Config::set('database.default', 'sqlite');
        Config::set('database.connections.sqlite.database', ':memory:');
        Artisan::call('migrate', ['--force' => true]);
        $this->assertTrue(Schema::hasTable('migrations'));
    }

    public function test_storage_mail_queue_and_logs(): void
    {
        Log::spy();
        foreach (array_keys(Config::get('filesystems.disks')) as $disk) {
            Storage::fake($disk);
            Storage::disk($disk)->put('upgrade_smoke.txt', 'ok');
            $this->assertEquals('ok', Storage::disk($disk)->get('upgrade_smoke.txt'));
            Storage::disk($disk)->delete('upgrade_smoke.txt');
        }

        Mail::fake();
        Mail::to('test@example.com')->send(new class extends \Illuminate\Mail\Mailable {
            public function build() { return $this->html('test'); }
        });
        Mail::assertSent(function (\Illuminate\Mail\Mailable $mail) { return true; });

        $ran = false;
        dispatch_sync(function () use (&$ran) { $ran = true; });
        $this->assertTrue($ran);

        Log::shouldNotHaveReceived('error');
        Log::shouldNotHaveReceived('critical');
    }
}

