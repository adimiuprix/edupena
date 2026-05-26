<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$subjects = App\Models\Mapel::doesntHave('targets')->pluck('mata_pelajaran');
foreach ($subjects as $s) {
    echo $s . "\n";
}
?>
