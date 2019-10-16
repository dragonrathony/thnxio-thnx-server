#!/bin/bash

file=$1

rm converted.sql
cp $file converted.sql

echo 'Preparing sql script by removing unwanted characters'

# remove starting fluff before first create table
sed -i '.bak' 's/\/\*.*\*\/;//g' converted.sql
sed -i '.bak' 's/SET.*;//g' converted.sql
sed -i '.bak' 's/enum(.*)/varchar/' converted.sql

# Remove AUTO_INCREMENT
sed -i '.back' 's/ AUTO_INCREMENT//g' converted.sql

sed -i '.back' '/PRIMARY KEY/d' converted.sql
sed -i '.back' '/UNIQUE KEY/d' converted.sql
sed -i '.back' '/CONSTRAINT/d' converted.sql
sed -i '.back' '/KEY `/d' converted.sql

# Fix end of lines
sed -i '.back' $'s/,\\\\n);/);/g' converted.sql

# remove ENGINE spec at end of create tables
sed -i '.bak' 's/ ENGINE\=.*/;/g' converted.sql

# remove uses of `
sed -i '.bak' 's/`//g' converted.sql

# remove uses of COLLATE utf8_unicode_ci
sed -i '.bak' 's/COLLATE utf8_unicode_ci//g' converted.sql

# remove uses of CHARACTER SET latin1
sed -i '.bak' 's/CHARACTER SET latin1//g' converted.sql

# remove uses of COLLATE utf8mb4_unicode_ci
sed -i '.bak' 's/COLLATE utf8mb4_unicode_ci//g' converted.sql

# remove uses of CHARACTER SET utf8
sed -i '.bak' 's/CHARACTER SET utf8//g' converted.sql

# replace datetime with timestamp
sed -i '.bak' 's/datetime/timestamp/g' converted.sql

# replace CURRENT_TIMESTAMP with now()
sed -i '.bak' 's/CURRENT_TIMESTAMP/now\(\)/g' converted.sql

# replace double with double precision
sed -i '.bak' 's/double /double precision /g' converted.sql

# replace double(10,2) UNSIGNED with double
sed -i '.bak' 's/double(10,2) UNSIGNED/double precision/g' converted.sql
sed -i '.bak' 's/double(10,2) unsigned/double precision/g' converted.sql

# replace int(*) with bigint
sed -i '.bak' 's/tinyint([[:digit:]]*)/int/g' converted.sql
sed -i '.bak' 's/int([[:digit:]]*)/bigint/g' converted.sql
sed -i '.bak' 's/bigbigint/bigint/g' converted.sql

# replace varchar(*) with varchar
sed -i '.bak' 's/varchar([[:digit:]]*)/varchar/g' converted.sql

# remove COMMENTS
sed -i '.bak' "s/COMMENT.*\'\,/,/g" converted.sql

# replace single quotes in string with two single quotes
sed -i '.bak' "s/\\\'/''/g" converted.sql

sed -i '.bak' 's/blob/bytea/' converted.sql

# remove session table
perl -i.bak -pe 'BEGIN{undef $/;} s/CREATE TABLE sessions.*?\)\;//smg' converted.sql
perl -i.bak -pe 'BEGIN{undef $/;} s/INSERT INTO sessions.*?\)\;//smg' converted.sql
perl -i.bak -pe 'BEGIN{undef $/;} s/ALTER TABLE.*?\;//smg' converted.sql

# remove error table
perl -i.bak -pe 'BEGIN{undef $/;} s/CREATE TABLE errors.*?\)\;//smg' converted.sql

# convert table names to legacy
sed -i '.bak' 's/CREATE TABLE gifts/CREATE TABLE gifts_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO gifts/INSERT INTO gifts_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE notification_template/CREATE TABLE notification_template_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO notification_template/INSERT INTO notification_template_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE notification_token_registration/CREATE TABLE notification_token_registration_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO notification_token_registration/INSERT INTO notification_token_registration_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE organization/CREATE TABLE organization_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO organization/INSERT INTO organization_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE payment/CREATE TABLE payment_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO payment/INSERT INTO payment_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE redemptions/CREATE TABLE redemptions_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO redemptions/INSERT INTO redemptions_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE transactions/CREATE TABLE transactions_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO transactions/INSERT INTO transactions_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE users/CREATE TABLE users_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO users/INSERT INTO users_legacy/g' converted.sql
sed -i '.bak' 's/CREATE TABLE merchants/CREATE TABLE merchants_legacy/g' converted.sql
sed -i '.bak' 's/INSERT INTO merchants/INSERT INTO merchants_legacy/g' converted.sql

echo 'Finished - converted file - converted.sql'

