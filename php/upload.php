<?php 
    $upload_dir = "./upload";  //implement this function yourself
    $img = $_POST['img'];
    $img = str_replace('data:image/png;base64,', '', $img);
    $img = str_replace(' ', '+', $img);
    $data = base64_decode($img);
    $d = new DateTime();
    $fname =  $d->format('Y-m-d H-i-s');
    $file = $upload_dir."/".$fname.".png";
    $success = file_put_contents($file, $data);
    //header('Location: '.$_POST['return_url']);
?>