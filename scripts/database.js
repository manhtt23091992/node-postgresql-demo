/**
 * Created by manhtt on 1/28/2016.
 */
var pg = require('pg');
var path = require('path');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:123456@localhost:5432/nodetest';
//var connectionString = require(path.join(__dirname, 'config'));

var client = new pg.Client(connectionString);
client.connect();
var query1 = client.query('' +
    'CREATE TABLE public."Users"("UserId" integer NOT NULL, "UserName" text,"Password" text,CONSTRAINT "Users_pkey" PRIMARY KEY ("UserId"))');
query1.on('end', function() {  });

var query2 = client.query('' +
    'INSERT INTO public."Users"("UserId", "UserName", "Password")VALUES (1, $1, $2);', ['admin', '123456']);
query2.on('end', function() {  });

var query3 = client.query('' +
    'CREATE OR REPLACE FUNCTION public.fn_login(IN p_username character varying,IN p_password character varying) ' +
    'RETURNS TABLE(userid integer, username text) AS ' +
    '$BODY$ ' +
    'BEGIN ' +
    'RETURN QUERY 	SELECT "UserId", "UserName" FROM public."Users" WHERE "UserName" = p_username and "Password" = p_password	; ' +
    'END; ' +
    '$BODY$ ' +
    '  LANGUAGE plpgsql VOLATILE ');
query3.on('end', function() { client.end(); });