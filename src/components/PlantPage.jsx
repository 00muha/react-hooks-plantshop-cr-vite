import React, { useEffect, useState } from "react";
import NewPlantForm from "./NewPlantForm";
import PlantList from "./PlantList";
import Search from "./Search";

function PlantPage() {
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load the backend collection once when the plant page mounts.
  useEffect(() => {
    fetch("http://localhost:6001/plants")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load plants");
        return response.json();
      })
      .then((fetchedPlants) => {
        // Keep plants created while the initial request was still pending.
        setPlants((currentPlants) => {
          const fetchedIds = new Set(fetchedPlants.map((plant) => plant.id));
          return [
            ...fetchedPlants,
            ...currentPlants.filter((plant) => !fetchedIds.has(plant.id)),
          ];
        });
      })
      .catch((error) => console.error(error));
  }, []);

  async function handleAddPlant(plant) {
    const response = await fetch("http://localhost:6001/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plant),
    });

    if (!response.ok) throw new Error("Unable to add plant");
    const savedPlant = await response.json();
    setPlants((currentPlants) => [...currentPlants, savedPlant]);
  }

  const visiblePlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <main>
      <NewPlantForm onAddPlant={handleAddPlant} />
      <Search searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <PlantList plants={visiblePlants} />
    </main>
  );
}

export default PlantPage;
