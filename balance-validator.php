<?php
header('Content-Type: application/json');
$balance = intval( $_POST[ "balance" ] );
$withdrawalAmount = intval( $_POST[ "withdrawalAmount" ] );
if ( $balance >= $withdrawalAmount ) {
?>
{"ok":1}
<?php	
} else {
?>
{"ok":0}
<?php
}	
?>