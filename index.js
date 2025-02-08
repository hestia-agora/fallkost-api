require("dotenv").config();
const cors = require("cors");
const express = require("express");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const riskCategories = [
  { name: "Risk för lindrigt skadade", effect: 2.4 },
  { name: "Risk för svårt skadade", effect: 1.8 },
  { name: "Risk för död", effect: 0.10 },
];

const interventions = [
  { name: "Fysisk träning", effect: 0.15 },
  { name: "Miljöanpassning hemtjänst", effect: 0.12 },
  { name: "Miljöanpassning Fysioterapeut", effect: 0.21 },
];

app.post("/calculate", (req, res) => {
  console.log("Inkommande data från frontend:", req.body);

  const { totalPopulation, riskCategoryName, costPerFall, interventionName } = req.body;

  if (!totalPopulation || !riskCategoryName || !costPerFall || !interventionName) {
    console.log("Felaktig inmatning:", req.body);
    return res.status(400).json({ error: "Alla fält måste fyllas i." });
  }

  const selectedRiskCategory = riskCategories.find(risk => risk.name === riskCategoryName);
  if (!selectedRiskCategory) {
    console.log("Ogiltig riskkategori:", riskCategoryName);
    return res.status(400).json({ error: "Ogiltig riskkategori vald." });
  }

  console.log("Vald riskkategori och procentsats:", selectedRiskCategory);

  console.log("Tillgängliga åtgärder:", interventions.map(i => i.name));

  const intervention = interventions.find(int => int.name.trim() === interventionName.trim());

  if (!intervention) {
    console.log("Ogiltig åtgärd mottagen:", interventionName);
    return res.status(400).json({ error: "Ogiltig åtgärd vald." });
  }

  console.log("Vald åtgärd och effekt:", intervention);

  const percentageInjured = selectedRiskCategory.effect / 100;
  const interventionEffect = intervention.effect;

  const fallsWithoutIntervention = totalPopulation * percentageInjured;
  const totalCostWithoutIntervention = fallsWithoutIntervention * costPerFall;
  const fallsWithIntervention = fallsWithoutIntervention * (1 - interventionEffect);
  const totalCostWithIntervention = fallsWithIntervention * costPerFall;
  const savingsPerYear = totalCostWithoutIntervention - totalCostWithIntervention;

  const responseData = {
    totalPopulation,
    riskCategoryName,
    interventionName,
    interventionEffect,
    fallsWithoutIntervention: Math.round(fallsWithoutIntervention),
    totalCostWithoutIntervention: Math.round(totalCostWithoutIntervention),
    fallsWithIntervention: Math.round(fallsWithIntervention),
    totalCostWithIntervention: Math.round(totalCostWithIntervention),
    savingsPerYear: Math.round(savingsPerYear),
  };

  console.log("Beräknat resultat:", responseData);
  res.json(responseData);
});

app.listen(PORT, () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});
