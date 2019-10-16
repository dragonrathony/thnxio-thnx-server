# THNX Server

This project includes both the *frontend* and *backend* projects for the Thnx hub.

# Installation

To install and start the app follow the instructions below.

## Prerequisites

* Ruby Version: 2.5.1

    > Using rbenv https://github.com/rbenv/rbenv

    ```
    rbenv install
    ```

* PostgreSQL
* Redis
* Rails Credentials

    You will either need to grab the master.key off of one of the other developers to access the config within the **credentials.yml.enc** file. _(NOTE we should probably just include a development master.key to ease new developers)_

    OR

    You will have to create a new pair. To achieve this first delete the existing (if any) **credentials.yml.enc** file:
    
    ```
    rm config/credentials.yml.enc
    ```
    
    Now create a new credential key pair:

    ```
    EDITOR=vim rails credentials:edit
    ```

    For more info see: https://guides.rubyonrails.org/security.html#custom-credentials

## Setup Rails App

First, install the gems required by the application for this we use bundler:

> https://bundler.io

```
bundle
```

Next, if the database does not exist and no **config/database.yml** file exists create one:

```
cp config/database.tmpl.yml config/database.yml
```

Now, setup the database: 

> This will run db:create, db:schema:load, db:seed

```
bundle exec rake db:setup
```

## Setup React

All that is required for this step is to install the dependencies:

```
npm install
```

## Start the App

_Phew_, now we should be all good to start the app. To orchestrate this we use foreman:

> https://github.com/ddollar/foreman

```
foreman start
```

The above command will start both the frontend and backend. To view the app navigate to:

```
http://localhost:3000
```

> Note if you get errors around **CORS** initialisers you may need to comment out line 15 from _config/initializers/cors.rb_

# Development Guide

The following describes the prefered development workflow to be followed when development and maintaining this project:

## Source Control Workflow

Would be good to add some stuff around this section, but this can come later for now.

## Testing

Would be good to add some stuff around this section, but this can come later for now.
