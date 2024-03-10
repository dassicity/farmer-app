# NodeJS Farm Management API

This project is a NodeJS-based API for managing farm, farmer, and schedule data. It provides endpoints for adding and querying farms, farmers, and their schedules, including the management of crops and fertilizer schedules.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   Node.js ([https://nodejs.org](https://nodejs.org/))
-   MongoDB ([https://www.mongodb.com/](https://www.mongodb.com/)) or access to a MongoDB database
-   A package manager like npm (comes with Node.js) or yarn

### Installing

First, clone the repository to your local machine:
```bash
git clone <repository-url>
``` 

Navigate to the project directory:

```bash
cd <project-directory>
``` 

Install the project dependencies:
```bash
npm install
``` 

or if you're using yarn:

```bash
yarn install
``` 

### Configuration

Create a `.env` file in the root of your project directory. This file should contain the following environment variables:

-   `PORT`: The port on which the Node.js server will run (e.g., `3000`).
-   `MONGODB_URI`: Your MongoDB connection URI.

Example `.env` file:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/farmdb
``` 

### Running the Server

With the dependencies installed and the environment variables set, you can start the server with:

```bash
npm start
``` 

or if you're using yarn:

```bash
yarn start
``` 

The server will start and listen on the port defined in your `.env` file. You can now make requests to your API endpoints.

## API Documentation

Refer to the [API Routes Documentation](#complete-api-documentation) section for details on the available endpoints, request parameters, and expected responses.

## Built With

-   [Node.js](https://nodejs.org/) - The runtime server
-   [Express.js](https://expressjs.com/) - The web framework used
-   [MongoDB](https://www.mongodb.com/) - The database used


---

# Complete API Documentation

## Farm Routes

### POST /api/farm/add

- **Description**: Adds a new farm record to the database.
- **Request Body**:
  - `area` (required): Area of the farm in hectares.
  - `village` (required): Name of the village where the farm is located.
  - `cropGrown` (required): Type of crop grown on the farm.
  - `sowingDate` (required): Date when the crop was sown (format: YYYY-MM-DD).
  - `farmerId` (required): ID of the farmer who owns the farm.
- **Response**: Returns a 201 status code and the created farm object. If required fields are missing or the farmer is not found, returns an error message with appropriate status code.

## Farmer Routes

### POST /api/farmers/add

- **Description**: Adds a new farmer record to the database.
- **Request Body**:
  - `phoneNumber` (required): Contact phone number of the farmer.
  - `name` (required): Name of the farmer.
  - `language` (required): Preferred language of the farmer.
- **Response**: Returns a 201 status code and the created farmer object. If required fields are missing, returns an error message with appropriate status code.

### GET /api/farmers/crop/:crop

- **Description**: Retrieves farmers who grow a specific crop.
- **URL Parameters**:
  - `crop` (required): Name of the crop to filter farmers by.
- **Response**: Returns a 200 status code and an array of farmers who grow the specified crop. If no farmers are found, returns an empty array.

### POST /api/farmers/:farmerId/bill

- **Description**: Calculates the bill of materials for a farmer based on fertilizer prices.
- **URL Parameters**:
  - `farmerId` (required): ID of the farmer for whom to calculate the bill.
- **Request Body**:
  - `fertilizerPrices` (required): Object containing fertilizer names as keys and their price information as values.
- **Response**: Returns a 200 status code and the total cost for solid and liquid fertilizers. If required data is missing or invalid, returns an error message with appropriate status code.

## Schedule Routes

### POST /api/schedule/add

- **Description**: Adds a new schedule for farm activities.
- **Request Body**:
  - `daysAfterSowing` (required): Number of days after sowing when the activity should be performed.
  - `fertilizer` (required): Name of the fertilizer to be used.
  - `quantity` (required): Quantity of the fertilizer.
  - `quantityUnit` (required): Unit of the quantity (e.g., kg, L).
  - `farmId` (required): ID of the farm for which the schedule is being created.
- **Response**: Returns a 201 status code and the created schedule object. If required fields are missing or the farm is not found, returns an error message with appropriate status code.

### GET /api/schedule/due

- **Description**: Retrieves schedules that are due for the current day and the next day.
- **Response**: Returns a 200 status code and objects containing schedules due for today and tomorrow. If an error occurs, returns an error message with appropriate status code.

---

Thank you!