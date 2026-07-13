<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->unsignedMediumInteger('id')->autoIncrement()->primary();
            $table->date('date');

            $table->unsignedSmallInteger('child_id');
            $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
            
            $table->boolean('is_present')->default(true);
            $table->text('note')->nullable(); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
