<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('article_tracking', function (Blueprint $table) {
            $table->id();
    
            // Link to platform_users instead of default users table
            $table->foreignId('platform_user_id')->constrained('platform_users')->onDelete('cascade');
    
            // Reference Statamic entry by UUID
            $table->uuid('entry_id');
            $table->foreign('entry_id')->references('id')->on('entries')->onDelete('cascade');
    
            $table->string('access_level');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('article_tracking');
    }
};
