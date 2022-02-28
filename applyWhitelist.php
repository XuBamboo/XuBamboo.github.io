<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8"/>
    <title>北冥鱼MCBEPU-公告</title>
    <meta name="viewport" content="width=device-width; initial-scale=1.0; minimum-scale=1.0; maximum-scale=1.0">
	<meta name="keywords" content="我的世界,我的世界基岩版,我的世界基岩版服务器,minecraft,mc,我的世界国际版,我的世界国际版服务器,MCBE,国际版,基岩版,北冥鱼,我的世界玩家,MCBEPU" />
	<meta name="description" content="北冥鱼：我的世界基岩版玩家联盟，英文名:Minecraft:Bedrock Edition Players' Union，简称MCBEPU。 本联盟涵盖单机、多人等多种模式。北冥鱼是一个由多个公益性质的基岩版服务器为基本而成的联盟。 " />
	<link rel="icon" href="./img/logo.png" />
	<link href="./css/minecraft.css" rel="stylesheet">
	<link href="./css/ui.css" rel="stylesheet">
	<link href="./css/style.css" rel="stylesheet">
</head>
<style>
    body {
        margin: 0;
    }

    .background {
        margin: 0 auto;
        max-width: 800px;
        min-width: 320px;
        padding-bottom: 0.1px;
    }
	
    .list {
        padding-top: 56px;
        padding-bottom: 10px;
    }

    .card {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
        background: #fff;
        margin: 10px;
        padding: 10px;
    }

    .list_title {
        color: #228B22;
        font-size: 25px;
        text-align: center; 
    }

    .list_content {
        font-size: 14px;
        margin: 5px;
        color: #757575;
        word-wrap: break-word;
        word-break: break-all;
    }

    .list_time {
        text-align: right;
        font-size: 13px;
        margin-top: 5px;
    }

</style>

<body>
	<br />	
<div class="background content">
    <!--公告列表-->
    <div class="list">
        <?php
        //公告路径
        $file = 'feedback.txt';

        //判断是否存在
        if (!is_file($file)) {

            echo '<div align="center">空空如也~</div>';

        } else {
            //读取文件
            $message = file_get_contents($file);

            //转化为数组
            $pieces = explode("<title>", $message);
            $arrlength = count($pieces);

            for ($x = 1; $x < $arrlength; $x++) {

                $data = $pieces[$x];

                //截取标题
                $title = strstr($data, '</title>', true);

                //截取内容
                $content = strstr(strstr($data, "<c>"), "</c>", true);

                //截取评论时间
                $time = strstr(strstr($data, "<time>"), "</time>", true);

                $content = str_replace("<c>", "", $content);

                $time = str_replace("<time>", "", $time);

                //输出内容
                echo '
            <div class="card">
            <div class="list_title">'.nl2br(htmlentities($title,ENT_QUOTES,"UTF-8")).'</div>
            <div class="list_content">'.nl2br(htmlentities($content,ENT_QUOTES,"UTF-8")).' </div>
            <div class="list_time">'.$time.'</div>
            </div>';

            }
        }
        ?>
    </div>
  </div>

		</body>
		<script type="text/javascript" src="./js/script.js"></script>
</html>