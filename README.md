# feathers-postgresql-starter

> A Feathers starter project including the Sequelize ORM for PostgreSQL.

> :warning: This project is outdated. The repo is archived.

## About

This project uses

* [Feathers](http://feathersjs.com) (v4.3.11) – an open source web framework for building modern real-time applications.
* [Sequelize](https://sequelize.org/) – a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.

It is based on the chat application in [The Feathers guide](https://docs.feathersjs.com/guides/basics/setup.html#what-we-will-do). Instead of the file-system based database NeDB in the guide's example, this project utilizes Sequelize/PostgreSQL.

### Features:

* Feathers with (local) authentication,

* Sequelize + PostgreSQL database adapter,

* Database migrations and seeding,

* A basic frontend written in HTML/CSS and (Vanilla) JavaScript.


## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    $ cd path/to/feathers-postgresql-starter
    $ npm install
    ```

3. Start your app

    ```
    $ npm start
    ```

Or run ``npm run dev`` during development, and the app will restart after any change in the source code.


## Database Setup

1. Have a PostgreSQL database up and running.

2. Set the database connection string in the ``.env`` file (see ``.env-example``). 

3. Run the app with ``npm start`` oder ``npm run dev``.


## Database Migrations and Seeding

This project is [already configured](https://github.com/feathersjs-ecosystem/feathers-sequelize#migrations) to use [migrations](https://sequelize.org/master/manual/migrations.html) for any change in the database structure. For an initial database setup just run

```
$ node_modules/.bin/sequelize db:migrate
```

This will run the scripts in ``migrations/scripts``, which create a ``users`` and a ``comments`` table.

You can [seed](https://sequelize.org/master/manual/migrations.html#running-seeds) the database with the command

```
$ node_modules/.bin/sequelize db:seed:all
```

This seeder will insert two users in the ``users`` table: ``jon@example.com`` and ``jane@example.com``. Both passwords are ``secret``.


## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```
