<?php

/* *
 * session start
 * 
 * */
session_start();

/* *
 * libs
 * 
 * */
@include('dibi.min.php');

/* *
 * logic
 * 
 * */
 
function getIp()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
      $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
      $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
      $ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

function printr($a)
{
	echo '<pre>';
	print_r($a);
	echo '</pre>';
}

function connectDB()
{
	dibi::connect(array(
	    'driver'   => 'mysql',
	    'host'     => 'localhost',
	    'username' => 'notesflow',
	    'password' => 'moncicak',
	    'database' => 'notesflow'
	));
}

if(isset($_GET['write']) && $_GET['write']==true) {
	connectDB();
	$insert=array('ip'=>getIp(),'note'=>$_GET['text'],'coords'=>$_GET['x'].':'.$_GET['y'],'date'=>time());
	$result = dibi::query('INSERT INTO [notes]',$insert);
	echo $result;
}

if(isset($_GET['read']) && $_GET['read']==true) {
	connectDB();
	$result = dibi::fetchAll('SELECT * FROM [notes] WHERE [ip] LIKE %~like~',getIp());
	echo json_encode($result);
}
 

?>