require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Calculation API
app.post("/calculate", (req, res) => {

  console.log("📥 Received Data from Frontend:", req.body);
  const { totalPopulation, riskCategoryEffect, costPerFall, interventionEffect } = req.body;

  if (totalPopulation == null || riskCategoryEffect == null || costPerFall == null || interventionEffect == null) {
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }

  const percentageInjured = riskCategoryEffect / 100;
  const fallsWithoutIntervention = totalPopulation * percentageInjured;
  const totalCostWithoutIntervention = fallsWithoutIntervention * costPerFall;
  const fallsWithIntervention = fallsWithoutIntervention * (1 - interventionEffect);
  const totalCostWithIntervention = fallsWithIntervention * costPerFall;
  const savingsPerYear = totalCostWithoutIntervention - totalCostWithIntervention;

  const responseData = {
    totalPopulation,
    riskCategoryEffect,
    interventionEffect,
    fallsWithoutIntervention: Math.round(fallsWithoutIntervention),
    totalCostWithoutIntervention: Math.round(totalCostWithoutIntervention),
    fallsWithIntervention: Math.round(fallsWithIntervention),
    totalCostWithIntervention: Math.round(totalCostWithIntervention),
    savingsPerYear: Math.round(savingsPerYear),
  };

  res.json(responseData);
});

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});