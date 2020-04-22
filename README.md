# Bulb Coding Challenge - Meter Readings

## Overview

Thank you for interviewing at Bulb and making the time to complete this coding exercise.

In this challenge, we are looking at the energy usage of a customer. We have built a very basic web server that processes the data and we would like you to improve it.

This challenge has two parts,

1.  Develop a meter reading API,
2.  Calculate monthly usage.

We ask that you do both tasks.

Time estimates below are guidelines, but you can choose to spend longer if you wish - just try not to spend significantly more time working on it than we suggest.

## Tasks

### 1. Create a meter reading API

For this task, we ask you to create a new REST API for meter readings, which we've started in `service/`. We're looking at how you structure and architect a service.

We have set up a very basic [Koa server](https://koajs.com/) in the `service/` directory, with a [Koa router](https://github.com/alexmingoia/koa-router). There is also a simple database set up in `service/data.js` that you can use to store anything you need for this task. It automatically imports all the meter readings from the `service/sampleData.json` file. You might want to quickly go over the documentation for [sqlite3](https://github.com/mapbox/node-sqlite3/wiki) to see how to use it.

For the purposes of this exercise, a meter reading is a cumulative number in kilowatt hours (kWh) shown by an electricity meter. To submit a meter reading, you must provide this number that's displayed on the meter, and the date that the reading was taken.

Create a simple RESTful API that can,

- retrieve a list of meter readings from the database,
- add a new meter reading that gets stored in the database,
- write appropriate tests. We have set up Mocha and Chai for this purpose (use `yarn test` to run it), but feel free to change the framework to something that works for you.

Do **not** focus on adding authentication, using a full database solution, dockerising the service, or worry about the number rolling over on the meter.

**This task should take you less than 2 hours.**

### 2. Calculate the monthly usage

For this task, we ask that you calculate the monthly electricity usage.

For the purposes of this exercise, a meter reading is a cumulative number in kilowatt hours (kWh) shown by an electricity meter. They can be entered at any time of the month.

An electricity meter is a device that measures electricity usage. For the purpose of this task a meter has following properties:

- It has a display of 5 digits making up a current cumulative number
- It increments the number according to the current usage of the electricity
- The number can only go up and never resets

Example of meters: https://en.wikipedia.org/wiki/Electricity_meter

Meter readings are used to calculate energy usage using a simple calculation:

```
  Energy Usage(period t1 -> t2) = MeterReading(t2) - MeterReading(t1)
```

To solve this task, we would like you to:

1.  Estimate the end of month meter readings (by interpolating the closest meter readings, i.e. the ones available just before and just after),
2.  Calculate the energy usage for the month based on the estimated end of month meter readings,

The usage data must be exposed via an API endpoint that the web application could receive. It should output each month, and the usage within that month. Use the data that you have seeded your database with.

**We think this task should take you about 1 hour.**

**Tips**

- You can assume there is exactly one meter reading per month,
- Don't try to interpolate at the edges of the dataset (i.e. if we don't have a meter reading for month M-1, then don't try to estimate the meter reading for month M),
- `EnergyUsage(month M) = MeterReading(last day of month M) - MeterReading(last day of month M-1)`,
- To deal with dates we recommend using [momentjs](https://momentjs.com). This is a great [cheatsheet](https://devhints.io/moment), but some useful tips,

  - Momentjs has a tendency to mutate moment objects.
  - We wrote a few functions below that may be handy, feel free to use them.
  - Feel free to use the following functions in your project.

    ```javascript
    /**
     * Check whether a moment object is the end of the month.
     * Ignore the time part.
     * @param {moment} mmt
     */
    function isEndOfMonth(mmt) {
      // startOf allows to ignore the time component
      // we call moment(mmt) because startOf and endOf mutate the momentj object.
      return moment
        .utc(mmt)
        .startOf('day')
        .isSame(
          moment
            .utc(mmt)
            .endOf('month')
            .startOf('day'),
        );
    }

    /**
     * Returns the difference between two moment objects in number of days.
     * @param {moment} mmt1
     * @param {moment} mmt2
     */
    function getDiffInDays(mmt1, mmt2) {
      return mmt1.diff(mmt2, 'days');
    }

    /**
     * Return the number of days between the given moment object
     * and the end of the month of this moment object.
     * @param {moment} mmt
     */
    function getDaysUntilMonthEnd(mmt) {
      return getDiffInDays(moment.utc(mmt).endOf('month'), mmt);
    }
    ```

## Practicalities

- Add how much time you spent on each of the exercise to [NOTES](./NOTES.md). Add any other notes explaining your approach.
- Do **not** add your name (or any details that can be used to identify you) on the code or the notes. This is to minimise any possible unconscious bias.
- Please, remember to delete the `node_modules` folder before zipping the project folder
- We will extend this exercise when you come on-site, so you may want to bring your own laptop if you can (you don't have to though).

## Setup

We write our applications in TypeScript. Each project is set up with the required build commands and uses loose compiler settings. You may wish to use stricter settings.

### Dependencies

- [Koa](https://koajs.com/) as the server framework,
- [Koa Router](https://github.com/alexmingoia/koa-router) for routing,
- [Mocha](https://mochajs.org/) as the test framework,
- [Chai](http://www.chaijs.com/) as the assertion library.

We use [yarn](https://yarnpkg.com/lang/en/docs/install/) to manage dependencies and we run node 8.9.x.

## Commands

- `yarn install` - install all dependencies
- `yarn build` - compile the TypeScript to JavaScript
- `yarn start` - compile and run the web server, watching for updates and restarting as required
- `yarn serve` - start the web server using the compiled JS. The code must be compiled first. Useful for running in production.
- `yarn test` - run all unit tests

If you get a port conflict when running the server use the `PORT` environment variable to change it, e.g. `PORT=3001 yarn start` or in Windows:

```
set PORT=3001
yarn start
```
