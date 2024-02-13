<?php

// Dependencies
use Tqdev\PhpCrudApi\Api;
use Tqdev\PhpCrudApi\Config\Config;
use Tqdev\PhpCrudApi\RequestFactory;
use Tqdev\PhpCrudApi\ResponseUtils;
require('vendor/autoload.php');

// Credentials
include('credentials.php');

// Configuration
$config = new Config([

    // Debug Mode
    'debug' => MYSQL_DATABASE === 'development',

    // Database
    'address' => MYSQL_HOST,
    'database' => MYSQL_DATABASE,
    'username' => MYSQL_USERNAME,
    'password' => MYSQL_PASSWORD
    
]);

// Initialization
$request = RequestFactory::fromGlobals();
$api = new Api($config);
$response = $api->handle($request);
ResponseUtils::output($response);