<?php

//获取标题
$title = $_GET['title'];

//获取内容
$content = $_GET['content'];

//判断值
if ($title == null || $content == null) {
    die('Please enter!');
}

//获取时间
$date = date("Y-m-d H");

//留言保存路径
$file = 'feedback.txt';

//组合方式
$c = '<title>' . $title . '</title><c>' . $content . '</c>';
$time = '<time>' . $date . '</time>';

//判断是否重复内容
if (substr_count(file_get_contents($file), $c) > 0) {
    die('Do not submit repeatedly!');
}


//追加写入内容
file_put_contents($file, $c . $time, FILE_APPEND);

echo 'Successful application! Please wait for the result!';




