<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlatformUsersTable extends Migration
{
    public function up()
{
    Schema::create('platform_users', function (Blueprint $table) {
        $table->id();
        $table->string('firebase_uid')->unique();
        $table->string('email')->unique();
        $table->string('fullname');
        $table->string('bio')->nullable();
        $table->string('gender')->nullable();
        $table->date('dob')->nullable();
        $table->string('country')->nullable();
        $table->string('profession')->nullable();
        $table->string('profile_display')->nullable();
        $table->string('password');
        $table->integer('remaining_free_articles')->default(3);
        $table->boolean('subscription_active')->default(false);
        $table->timestamp('subscription_expires_at')->nullable();
        $table->timestamp('last_login_at')->nullable();
        $table->rememberToken(); // ✅ Add remember_token field
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('platform_users');
    }
}
