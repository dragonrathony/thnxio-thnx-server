#!/bin/bash

db=$1

rake db:reset

psql $db < converted.sql

rake database:all

psql $db < remove_legacy_tables.sql

#rm converted.*
