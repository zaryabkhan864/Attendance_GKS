import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';



const app = express.app();


app.listen(5000, () => {
    console.log("server started at http://localhost:5000");
});