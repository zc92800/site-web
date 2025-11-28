const API_KEY = "19ab624af4804c2889e92db3aac19794";

let lastSearchResults = [];

// Chargement automatique des recettes au lancement de la page
window.onload = function () {
    loadDefaultRecipes();
};

// Charge 20 recettes par default
async function loadDefaultRecipes() {
    const resultsBox = document.getElementById("results");
    resultsBox.innerHTML = "<p>Chargement des recettes...</p>";

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&number=20`
        );

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            resultsBox.innerHTML = "<p>Aucune recette trouvée.</p>";
            return;
        }

        // On garde les résultats pour pouvoir revenir en arrière
        lastSearchResults = data.results;

        // Affiche les cartes de recettes
        displayResults(data.results);

    } catch (err) {
        console.error(err);
        resultsBox.innerHTML = "<p>Erreur lors du chargement des recettes.</p>";
    }
}

// Fonction appelée quand l'utilisateur effectue une recherche
async function searchAPI() {
     const query = document.getElementById("searchInput").value.trim();
     const resultsBox = document.getElementById("results");

    if (!query) {
        resultsBox.innerHTML = "<p>Veuillez entrer un terme de recherche.</p>";
         return;
    }

    resultsBox.innerHTML = "<p>Recherche en cours...</p>";

    try {
        // Recherche de recettes via l'API Spoonacular
        const response = await fetch(
             `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=10`
        );

         const data = await response.json();
  
         if (!data.results || data.results.length === 0) {
             resultsBox.innerHTML = "<p>Aucune recette trouvée.</p>";
            return;
        }

        lastSearchResults = data.results;
        displayResults(data.results);

     } catch (err) {
        console.error(err);
        resultsBox.innerHTML = "<p>Erreur pendant la recherche.</p>";
    }
}

// Affiche toutes les cartes de recettes
function displayResults(results) {
    const resultsBox = document.getElementById("results");

    resultsBox.innerHTML = results
        .map(recipe => `
            <div class="recipe-card" onclick="loadRecipe(${recipe.id})">
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
        `)
        .join("");
}

// Charge les informations détaillées d'une recette
async function loadRecipe(id) {
         const resultsBox = document.getElementById("results");
    resultsBox.innerHTML = "<p>Chargement de la recette...</p>";

      try {
         const response = await fetch(
             `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
        );

        const recipe = await response.json();

        // Affiche la page détaillée de la recette
        resultsBox.innerHTML = `
        <div class="recipe-details">
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" style="width:300px; border-radius:10px; display:block; margin:auto;">
                
                <h3>Ingrédients</h3>
                <ul>
                    ${recipe.extendedIngredients
                        .map(ing =>`<li>${ing.original}</li>`)
                        .join("")}
                </ul>

                <h3>Instructions</h3>
                <p>${recipe.instructions || "Aucune instruction disponible."}</p>

                <button onclick="goBack()" class="back-btn">Retour</button>
            </div>
        `;
    } catch (err) {
        console.error(err);
        resultsBox.innerHTML = "<p>Impossible de charger la recette.</p>";
    }
}
// Revient à la liste précédente des recettes
function goBack() {
    displayResults(lastSearchResults);
}
